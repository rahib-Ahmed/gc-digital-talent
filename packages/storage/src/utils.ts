import { useCallback, useState } from "react";

export function getFromStorage<T>(
  store: Storage | undefined,
  key: string,
  defaultValue: T,
): T {
  // TODO: Is it worth allowing store to be undefined? And why catch and hide errors here?
  if (store === undefined) {
    return defaultValue;
  }
  try {
    // Get from local storage by key
    const item = store.getItem(key);
    // Parse stored json or if none return defaultValue
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    // If error also return defaultValue
    // console.log(error);
    return defaultValue;
  }
}

export function setInStorage<T>(
  store: Storage | undefined,
  key: string,
  value: T,
): void {
  if (store) {
    store.setItem(key, JSON.stringify(value));
  }
}

export function removeFromStorage(
  store: Storage | undefined,
  key: string,
): void {
  if (store) {
    store.removeItem(key);
  }
}

/** Sync state to local storage so that it persists through a page refresh. Usage is similar to useState except we pass in a local storage key so that we can default to that value on page load instead of the specified initial value.
 * https://usehooks.com/useLocalStorage/
 * @param  {string} key
 * @param  {T} initialValue
 */
export function useStorage<T>(store: Storage, key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getFromStorage(store, key, initialValue);
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function
            ? value(getFromStorage(store, key, initialValue))
            : value;
        // Save state
        setStoredValue(valueToStore);
        // Save to local storage
        setInStorage(store, key, valueToStore);
      } catch (error) {
        // A more advanced implementation would handle the error case
        // console.log(error);
      }
    },
    [store, key, initialValue],
  );

  return [storedValue, setValue] as const;
}
