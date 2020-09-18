import _sortBy from "lodash/sortBy";
import _sumBy from "lodash/sumBy";
import _minBy from "lodash/minBy";
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

export const splitIntoTwoBalancedLists = <T>(
  items: T[],
  getValue: (item: T) => number
): [T[], T[]] => {
  const sorted = _sortBy(items, getValue).reverse();
  const left: T[] = [];
  const right: T[] = [];
  for (const item of sorted) {
    const diffIfAddedToLeft = getLeftRightDifference(
      left,
      right,
      item,
      Side.Left,
      getValue
    );
    const diffIfAddedToRight = getLeftRightDifference(
      left,
      right,
      item,
      Side.Right,
      getValue
    );
    if (diffIfAddedToLeft <= diffIfAddedToRight) {
      left.push(item);
    } else {
      right.push(item);
    }
  }
  return [left, right];
};

interface DifferenceForPartitionIndex {
  difference: number;
  partitionIndex: number;
}
export const getPartitionPointToMinimizeDifferences = <T>(
  items: T[],
  getValue: (item: T) => number
): [T[], T[]] => {
  const differencesForPartitionIndex: DifferenceForPartitionIndex[] = [];
  for (let i = 0; i < items.length - 1; i += 1) {
    const left = items.slice(0, i + 1);
    const right = items.slice(i + 1);
    const leftSum = _sumBy(left, getValue);
    const rightSum = _sumBy(right, getValue);
    const difference = Math.abs(leftSum - rightSum);
    differencesForPartitionIndex.push({ difference, partitionIndex: i });
  }
  const min = _minBy(
    differencesForPartitionIndex,
    ({ difference }) => difference
  )!.partitionIndex;
  return [items.slice(0, min + 1), items.slice(min + 1)];
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
  if (isLargeScreen) {
    const [left, right] = splitIntoTwoBalancedLists(
      unprocessedRoleList,
      getRoleListApproxHeight
    );
    leftRoleLists = left;
    rightRoleLists = right;
  } else {
    leftRoleLists = unprocessedRoleList;
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
  const unsortedProcessedStudies: ProcessedStudies = new Map();
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

  for (const { studyIds, role, name: contributorName } of studyContributors) {
    for (const studyId of studyIds) {
      const studyName = studyLookup.get(studyId);
      if (studyName !== undefined) {
        const retrievedStudy = unsortedProcessedStudies.get(studyId);
        let study: ProcessedStudy;
        if (retrievedStudy === undefined) {
          study = {
            name: studyName,
            contributorsByRole: new Map(),
          };
          unsortedProcessedStudies.set(studyId, study);
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
    [...unsortedProcessedStudies.entries()],
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

  let leftColumnStudies: DisplayedStudy[], rightColumnStudies: DisplayedStudy[];
  if (isLargeScreen) {
    const [left, right] = getPartitionPointToMinimizeDifferences(
      displayedProcessedStudies,
      getStudyApproxHeight
    );
    const joined = [...left, ...right];
    leftColumnStudies = [];
    rightColumnStudies = [];
    for (let i = 0; i < joined.length; i += 1) {
      const study = joined[i];
      if (i % 2 == 0) {
        leftColumnStudies.push(study);
      } else {
        rightColumnStudies.push(study);
      }
    }
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
