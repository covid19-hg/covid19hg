import { splitIntoTwoBalancedLists } from "../acknowledgementUtils";

test("splitIntoBalancedLists", () => {
  const input = [1, 3, 4, 5, 7, 8, 9, 11, 65, 74, 83, 100];
  const [first, second] = splitIntoTwoBalancedLists(input, (item) => item);
  expect(first).toEqual([100, 65, 9, 7, 4]);
  expect(second).toEqual([83, 74, 11, 8, 5, 3, 1]);
});
