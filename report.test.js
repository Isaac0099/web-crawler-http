const { sortPages, printReport } = require("./report.js");
const { test, expect } = require("@jest/globals");

test("sortPages 5 pages", () => {
  const input = {
    "https://wagslane.dev/path": 3,
    "https://wagslane.dev": 333,
    "https://wagslane.dev/path2": 89,
    "https://wagslane.dev/path3": 1,
    "https://wagslane.dev/path4": 2,
    "https://wagslane.dev/path5": 55,
  };
  const actual = sortPages(input);
  const expected = [
    ["https://wagslane.dev", 333],
    ["https://wagslane.dev/path2", 89],
    ["https://wagslane.dev/path5", 55],
    ["https://wagslane.dev/path", 3],
    ["https://wagslane.dev/path4", 2],
    ["https://wagslane.dev/path3", 1],
  ];
  expect(actual).toEqual(expected);
});
