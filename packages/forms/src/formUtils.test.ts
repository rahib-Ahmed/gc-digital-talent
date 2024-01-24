/**
 * @jest-environment jsdom
 */

import {
  matchStringCaseDiacriticInsensitive,
  enumToOptions,
  countNumberOfWords,
  alphaSort,
} from "./utils";

describe("string matching tests", () => {
  const f = matchStringCaseDiacriticInsensitive;
  test("it doesn't match strings that are clearly different", () => {
    expect(f("apples", "oranges")).toBeFalsy();
  });
  test("it matches simple strings", () => {
    expect(f("tomato", "tomato")).toBeTruthy();
  });
  test("it matches strings with diacritics to the simplified version", () => {
    expect(f("facade", "façade")).toBeTruthy();
  });
  test("it matches strings with diacritics to the same string", () => {
    expect(f("façade", "façade")).toBeTruthy();
  });
});

describe("string matching tests - assert special characters match and do not crash", () => {
  const f = matchStringCaseDiacriticInsensitive;
  test("assert special characters match and do not crash", () => {
    expect(f("+", "C++")).toBeTruthy();
    expect(f("*", "C*")).toBeTruthy();
    expect(f("(", "C(")).toBeTruthy();
    expect(f(")", "C)")).toBeTruthy();
    expect(f("?", "C?")).toBeTruthy();
    expect(f("[", "C[")).toBeTruthy();
    expect(f("]", "C]")).toBeTruthy();
    expect(f("\\", "C\\")).toBeTruthy();
  });
});

describe("enumToOptions tests", () => {
  // enums generated by codegen are alphabetically sorted
  enum Fruit {
    Apples = "APPLES",
    Bananas = "BANANAS",
    DragonFruit = "DRAGON_FRUIT",
  }

  test("it works for strings without sorting", () => {
    const expectedOptions: { value: string | number; label: string }[] = [
      { value: "APPLES", label: "Apples" },
      { value: "BANANAS", label: "Bananas" },
      { value: "DRAGON_FRUIT", label: "DragonFruit" },
    ];
    const actualOptions = enumToOptions(Fruit);
    expect(actualOptions).toEqual(expectedOptions);
  });

  test("it works with a complete sort order", () => {
    const sortOrder = [Fruit.DragonFruit, Fruit.Bananas, Fruit.Apples];
    const expectedOptions: { value: string | number; label: string }[] = [
      { value: "DRAGON_FRUIT", label: "DragonFruit" },
      { value: "BANANAS", label: "Bananas" },
      { value: "APPLES", label: "Apples" },
    ];
    const actualOptions = enumToOptions(Fruit, sortOrder);
    expect(actualOptions).toEqual(expectedOptions);
  });

  test("it works with an incomplete sort order and sends missing entries to the end", () => {
    const sortOrder = [Fruit.DragonFruit, Fruit.Bananas];
    const expectedOptions: { value: string | number; label: string }[] = [
      { value: "DRAGON_FRUIT", label: "DragonFruit" },
      { value: "BANANAS", label: "Bananas" },
      { value: "APPLES", label: "Apples" },
    ];
    const actualOptions = enumToOptions(Fruit, sortOrder);
    expect(actualOptions).toEqual(expectedOptions);
  });
});

describe("countNumberOfWords tests", () => {
  test("should return the zero for empty string", () => {
    const emptyString = "";
    const numOfWords = countNumberOfWords(emptyString);
    expect(numOfWords).toEqual(0);
  });

  test("should return the correct number of words of string with extra white space", () => {
    let textWithWhiteSpace = "  Hello  World!  ";
    let numOfWords = countNumberOfWords(textWithWhiteSpace);
    expect(numOfWords).toEqual(2);
    textWithWhiteSpace = "     ";
    numOfWords = countNumberOfWords(textWithWhiteSpace);
    expect(numOfWords).toEqual(0);
    textWithWhiteSpace = "a p p l e";
    numOfWords = countNumberOfWords(textWithWhiteSpace);
    expect(numOfWords).toEqual(5);
  });

  test("should return the correct number of words of string with numbers and special characters", () => {
    const textWithNumbers = "This243 is a 100.";
    let numOfWords = countNumberOfWords(textWithNumbers);
    expect(numOfWords).toEqual(4);
    const textWithSpecialCharacters = "*(Y$# hello#$# wo$#rld ....)(*";
    numOfWords = countNumberOfWords(textWithSpecialCharacters);
    expect(numOfWords).toEqual(4);
    const textWithBoth = "L34#$# &(*da($# this is a 34^@# sentence.";
    numOfWords = countNumberOfWords(textWithBoth);
    expect(numOfWords).toEqual(7);
  });
});

test("should sort array of strings alphabetically", () => {
  // alphabetical handling of capitalization
  let sortedList = ["Aa", "Bb", "Cc", "Dd", "Ee", "Ff"];

  let unsortedList = ["Dd", "Ee", "Aa", "Bb", "Ff", "Cc"];

  let modifiedList = alphaSort(unsortedList);
  expect(modifiedList).toStrictEqual(sortedList);

  // handling of French accented characters
  sortedList = ["à", "ä", "Ç", "é", "É", "ü"];

  unsortedList = ["Ç", "à", "é", "ü", "É", "ä"];

  modifiedList = alphaSort(unsortedList, "fr");
  expect(modifiedList).toStrictEqual(sortedList);

  // handling of non-alphanumeric characters
  // Non-alphanumeric sort order: _-,;:!?.'"()@*/\&#%`^<>|~$ (https://support.google.com/drive/thread/150638299?hl=en&msgid=150657957)
  sortedList = [
    "_",
    "-",
    ",",
    ";",
    ":",
    "!",
    "?",
    ".",
    "@",
    "*",
    "&",
    "#",
    "%",
    "~",
    "$",
  ];

  unsortedList = [
    "_",
    ";",
    ":",
    "$",
    "?",
    "!",
    "~",
    ",",
    "-",
    "@",
    "*",
    "%",
    ".",
    "#",
    "&",
  ];

  modifiedList = alphaSort(unsortedList);
  expect(modifiedList).toStrictEqual(sortedList);

  // handling all edge cases together
  sortedList = [
    ".NET Programming",
    "~alpha",
    "azure",
    "C#",
    "C++",
    "Database Design & Data Administration",
    "F# or Visual Basic",
    "integrity",
    "python",
    "React",
  ];

  unsortedList = [
    "React",
    "azure",
    ".NET Programming",
    "integrity",
    "~alpha",
    "C#",
    "F# or Visual Basic",
    "python",
    "Database Design & Data Administration",
    "C++",
  ];

  modifiedList = alphaSort(unsortedList);
  expect(modifiedList).toStrictEqual(sortedList);
});
