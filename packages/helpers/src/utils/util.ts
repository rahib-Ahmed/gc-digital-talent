import pick from "lodash/pick";

import { InputMaybe, Maybe } from "@gc-digital-talent/graphql";

export function identity<T>(value: T): T {
  return value;
}

/**
 * Returns true if value is not null or undefined.
 * Can be used to filter nulls and undefined values out of an array in a
 * typescript-compatible way.
 * @param item
 * @see https://stackoverflow.com/a/46700791
 */
export function notEmpty<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  return value !== null && value !== undefined;
}

/**
 * Returns true if value id null OR undefined.
 * @param item
 */
export function empty<T>(
  value: T | null | undefined,
): value is null | undefined {
  return value === null || value === undefined;
}

export function getId<T extends { id: string }>(item: T): string {
  return item.id;
}

/**
 * Checks if an object has an attribute with a particular key
 * @param object
 * @param key
 */
export function hasKey<T>(
  object: { [key: string]: T },
  key: string | number,
): boolean {
  return object[key] !== undefined;
}

/**
 * Returns the value at the specified key. If the key is not present, throws an error.
 * @param object
 * @param key
 * @param errorMessage
 */
export function getOrThrowError<T>(
  object: { [key: string]: T },
  key: string | number,
  errorMessage: string,
): T {
  if (!hasKey(object, key)) {
    throw new Error(errorMessage);
  }
  return object[key];
}

/** Return a copy of the object with specific property removed */
export function deleteProperty<T, K extends keyof T>(
  obj: T,
  key: K,
): Omit<T, K> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [key]: _, ...newObj } = obj;
  return newObj;
}

/**
 * Inserts a separator between each pair of adjacent items in an array.
 * Kind of like array.join, except it leaves you with an array rather than a string.
 */
export function insertBetween<T>(separator: T, arr: T[]): T[] {
  return arr.reduce<T[]>((prev, curr, i) => {
    // When i === 0, prev is []. We only want separator between our original items, not at the beginning.
    if (i > 0) {
      prev.push(separator);
    }
    prev.push(curr);
    return prev;
  }, []);
}

/**
 * Tests if a string is boolean true
 * https://stackoverflow.com/a/264037
 * https://stackoverflow.com/a/2140644
 */
export function isStringTrue(str: string | undefined): boolean {
  return str?.toLocaleUpperCase() === "TRUE";
}

/**
 * Accepts a input value and transforms empty strings to a null
 * @param s String value from an input
 * @returns The possibly-transformed-to-null input string
 */
export const emptyToNull = (s: InputMaybe<string>): string | null =>
  empty(s) || s === "" ? null : s;

/**
 * Accepts a input value and transforms empty strings to a undefined
 * @param s String value from an input
 * @returns The possibly-transformed-to-undefined input string
 */
export const emptyToUndefined = (s: InputMaybe<string>): string | undefined =>
  empty(s) || s === "" ? undefined : s;

/**
 * Accepts an array of items and removes all duplicate items
 *
 * @param arr Array<T>  Array of items
 * @returns   Array<T>  New array with no duplicates
 */
export function uniqueItems<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * Group an array of objects by specific
 * callback function
 *
 * @param arr Array of items
 * @param mapper  Callback function to determine items key
 * @returns Record<PropertyKey, Foo[]>
 */
export function groupBy<
  RetType extends PropertyKey,
  T,
  Func extends (arg: T) => RetType,
>(arr: T[], mapper: Func): Record<RetType, T[]> {
  return arr.reduce(
    (accumulator, val) => {
      const groupedKey = mapper(val);
      if (!accumulator[groupedKey]) {
        accumulator[groupedKey] = [];
      }
      accumulator[groupedKey].push(val);
      return accumulator;
    },
    {} as Record<RetType, T[]>,
  );
}

/**
 * A small function to assert that code execution should never
 * reach this location. Handy for generate compile-time errors
 * for non-exhaustive switch statements.
 *
 * Copied from https://stackoverflow.com/a/39419171
 *
 * @param x Not used, but important that it is typed _never_
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to be reachable.");
}

/*
 * Filters out empty data from data response.
 * @param data
 * @returns T[]
 */
export function unpackMaybes<T>(data: Maybe<Array<Maybe<T>>>): T[] {
  return data?.filter(notEmpty) ?? [];
}

// Apply pick to each element of an array.
export function pickMap<T, K extends keyof T>(
  list: Maybe<Maybe<T>[]> | null | undefined,
  keys: K | K[],
): Pick<T, K>[] | undefined {
  return unpackMaybes(list).map(
    (item) => pick(item, keys) as Pick<T, K>, // I think this type coercion is safe? But I'm not sure why its not the default...
  );
}
