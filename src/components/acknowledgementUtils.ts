import _sortBy from "lodash/sortBy";
import _sumBy from "lodash/sumBy";
import _last from "lodash/last";
import type {
  ContributorDatum as RawContributor,
  AirtableDatum,
} from "../types";
import _uniq from "lodash/uniq";

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

export type ProcessedStudies = Map<string, ProcessedStudy>;

export interface RoleList {
  name: string;
  contributors: string[];
}
export interface DisplayedStudy {
  name: string;
  id: string;
  approxRoleListsHeight: number;
  leftRoleLists: RoleList[];
  rightRoleLists: RoleList[];
}

export type Contributor = StudyContributor | AdhocContributor;

export const sortByLastName = (names: string[]) =>
  _sortBy(names, (name) => _last(name.toLowerCase().split(" ")));

// Approximate height of a role's title compared to the height of a line of
// normal paragaph text:
const approxHeightOfRoleTitle = 2;
const getRoleListApproxHeight = ({ contributors }: RoleList) =>
  contributors.length + approxHeightOfRoleTitle;

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

const approxHeightOfStudyTitle = 4;
const getStudyApproxHeight = ({ approxRoleListsHeight }: DisplayedStudy) =>
  approxRoleListsHeight + approxHeightOfStudyTitle;

const getDisplayedStudy = (
  { name: studyName, contributorsByRole }: ProcessedStudy,
  id: string,
  isLargeScreen: boolean
): DisplayedStudy => {
  const unprocessedRoleList: RoleList[] = _sortBy(
    [...contributorsByRole.entries()].map(([role, contributors]) => ({
      name: role,
      contributors: _uniq(contributors),
    })),
    ({ name }) => name
  );
  let leftRoleLists: RoleList[];
  let rightRoleLists: RoleList[];
  // Use two-column layout for large screen and one-column layout for small
  // screen:
  if (isLargeScreen) {
    const [left, right] = splitIntoTwoBalancedLists(
      _sortBy(unprocessedRoleList, getRoleListApproxHeight).reverse(),
      getRoleListApproxHeight
    );
    leftRoleLists = left;
    rightRoleLists = right;
  } else {
    leftRoleLists = _sortBy(
      unprocessedRoleList,
      getRoleListApproxHeight
    ).reverse();
    rightRoleLists = [];
  }
  const approxRoleListsHeight = Math.max(
    _sumBy(leftRoleLists, getRoleListApproxHeight),
    _sumBy(rightRoleLists, getRoleListApproxHeight)
  );
  return {
    approxRoleListsHeight,
    id,
    leftRoleLists,
    rightRoleLists,
    name: studyName,
  };
};

export const processContributorList = (
  contributors: RawContributor[],
  studies: AirtableDatum[],
  isLargeScreen: boolean
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

  const displayedProcessedStudies = processedStudies.map(([id, study]) =>
    getDisplayedStudy(study, id, isLargeScreen)
  );

  // Use two-column layout for large screen and one-column layout for small screen:
  let leftColumnStudies: DisplayedStudy[], rightColumnStudies: DisplayedStudy[];
  if (isLargeScreen) {
    [leftColumnStudies, rightColumnStudies] = splitIntoTwoBalancedLists(
      displayedProcessedStudies,
      getStudyApproxHeight
    );
  } else {
    leftColumnStudies = displayedProcessedStudies;
    rightColumnStudies = [];
  }

  const displayedAdhocGroups = [...processedAdhocGroups.values()].map((group) =>
    getDisplayedStudy(group, "", isLargeScreen)
  );

  return {
    leftColumnStudies,
    rightColumnStudies,
    adhocGroups: displayedAdhocGroups,
  };
};
