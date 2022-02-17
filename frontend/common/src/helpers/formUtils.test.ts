/**
 * @jest-environment jsdom
 */

import { matchStringCaseDiacriticInsensitive, enumToOptions } from "./formUtils";

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
