import _sortBy from "lodash/sortBy";
import _sumBy from "lodash/sumBy";
import _minBy from "lodash/minBy";
import _last from "lodash/last";
import { RoleList } from "./AcknowlegementPageContent";

export const sortByLastName = (names: string[]) =>
  _sortBy(names, (name) => _last(name.toLowerCase().split(" ")));

export const adminTeamName = "COVID-19 Host Genetics Initiative Coordination";

// Approximate height of a role's title compared to the height of a line of
// normal paragaph text:
const approxHeightOfRoleTitle = 2;
export const getRoleListApproxHeight = ({ contributors }: RoleList) =>
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
