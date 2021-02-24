import _sortBy from "lodash/sortBy";
import _sumBy from "lodash/sumBy";
import _last from "lodash/last";
import type {
  ContributorDatum as RawContributor,
  AirtableDatum,
} from "../types";

interface BaseContributor {
  name: string;
  role: string;
  affiliation: string;
  affiliationLink: string | undefined;
  id: string;
}

enum ContributorType {
  Study,
  Adhoc,
}
interface StudyContributor extends BaseContributor {
  type: ContributorType.Study;
  studyIds: string[];
}
interface AdhocContributor extends BaseContributor {
  type: ContributorType.Adhoc;
  adhocGroup: string;
}

export interface ProcessedStudy {
  name: string;
  contributorsByRole: Map<string, string[]>;
}

type ProcessedStudies = Map<string, ProcessedStudy>;

export type Contributor = StudyContributor | AdhocContributor;

export const sortByLastName = (names: string[]) =>
  _sortBy(names, (name) => _last(name.toLowerCase().split(" ")));

enum Side {
  Left,
  Right,
}
const getLeftRightDifference = <T>(
  left: T[],
  right: T[],
  value: T,
  side: Side,
  getValue: (item: T) => number
): number => {
  let newLeft = left;
  let newRight = right;
  if (side === Side.Left) {
    newLeft = [...left, value];
  } else {
    newRight = [...right, value];
  }
  const difference = Math.abs(
    _sumBy(newLeft, getValue) - _sumBy(newRight, getValue)
  );
  return difference;
};

// Add items one-by-one to left or right column to minimize differences in
// height between them:
export const splitIntoTwoBalancedLists = <T>(
  items: T[],
  getItemHeight: (item: T) => number
): [T[], T[]] => {
  const left: T[] = [];
  const right: T[] = [];
  for (const item of items) {
    const diffIfAddedToLeft = getLeftRightDifference(
      left,
      right,
      item,
      Side.Left,
      getItemHeight
    );
    const diffIfAddedToRight = getLeftRightDifference(
      left,
      right,
      item,
      Side.Right,
      getItemHeight
    );
    if (diffIfAddedToLeft <= diffIfAddedToRight) {
      left.push(item);
    } else {
      right.push(item);
    }
  }
  return [left, right];
};

export const splitProcessedStudiesIntoTwoBalancedLists = (pairs: [string, ProcessedStudy][]) =>
  splitIntoTwoBalancedLists(pairs, getStudyApproxHeight)

// These are measured empirically:
const approxHeightOfStudyTitle = 1.16;
const approxHeightOfRoleTitle = 1.3
export const getStudyApproxHeight = ([, {contributorsByRole}]: [unknown, ProcessedStudy]) => {
  let summedHeightsOfAllRoles = 0
  for (const roleMembers of contributorsByRole.values()) {
    summedHeightsOfAllRoles += (approxHeightOfRoleTitle + roleMembers.length * 1)
  }
  return summedHeightsOfAllRoles / 2 + approxHeightOfStudyTitle
}
export const processContributorList = (
  contributors: RawContributor[],
  studies: AirtableDatum[],
) => {
  const studyLookup = new Map(
    studies.map(({ id, study }) => [id, study] as const)
  );
  const studyContributors: StudyContributor[] = [];
  const adhocContributors: AdhocContributor[] = [];
  for (const item of contributors) {
    if ("studyIds" in item) {
      const {
        contributor,
        role,
        affiliation,
        affiliationLink,
        id,
        studyIds,
      } = item;
      studyContributors.push({
        name: contributor,
        role,
        affiliation,
        affiliationLink,
        id,
        studyIds,
        type: ContributorType.Study,
      });
    } else if ("adhocGroup" in item) {
      const {
        contributor,
        role,
        affiliation,
        affiliationLink,
        id,
        adhocGroup,
      } = item;
      adhocContributors.push({
        name: contributor,
        role,
        affiliation,
        affiliationLink,
        id,
        adhocGroup,
        type: ContributorType.Adhoc,
      });
    }
  }

  const allContributorsPerStudy: ProcessedStudies = new Map();
  for (const { studyIds, role, name: contributorName } of studyContributors) {
    for (const studyId of studyIds) {
      const studyName = studyLookup.get(studyId);
      if (studyName !== undefined) {
        const retrievedStudy = allContributorsPerStudy.get(studyId);
        let study: ProcessedStudy;
        if (retrievedStudy === undefined) {
          study = {
            name: studyName,
            contributorsByRole: new Map(),
          };
          allContributorsPerStudy.set(studyId, study);
        } else {
          study = retrievedStudy;
        }

        const retrievedContributorsInThisRole = study.contributorsByRole.get(
          role
        );
        let contributorsInThisRole: string[];
        if (retrievedContributorsInThisRole === undefined) {
          contributorsInThisRole = [];
          study.contributorsByRole.set(role, contributorsInThisRole);
        } else {
          contributorsInThisRole = retrievedContributorsInThisRole;
        }
        contributorsInThisRole.push(contributorName);
      }
    }
  }
  const processedStudies = _sortBy(
    [...allContributorsPerStudy.entries()],
    ([, { name }]) => name.toLowerCase()
  );

  const processedAdhocGroups: ProcessedStudies = new Map();
  for (const { adhocGroup, role, name: contributorName } of adhocContributors) {
    const retrievedStudy = processedAdhocGroups.get(adhocGroup);
    let study: ProcessedStudy;
    if (retrievedStudy === undefined) {
      study = {
        name: adhocGroup,
        contributorsByRole: new Map(),
      };
      processedAdhocGroups.set(adhocGroup, study);
    } else {
      study = retrievedStudy;
    }

    const retrievedContributorsInThisRole = study.contributorsByRole.get(role);
    let contributorsInThisRole: string[];
    if (retrievedContributorsInThisRole === undefined) {
      contributorsInThisRole = [];
      study.contributorsByRole.set(role, contributorsInThisRole);
    } else {
      contributorsInThisRole = retrievedContributorsInThisRole;
    }
    contributorsInThisRole.push(contributorName);
  }

  return {
    processedAdhocGroups, processedStudies
  };
};
