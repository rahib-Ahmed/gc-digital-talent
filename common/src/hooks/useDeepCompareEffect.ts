import isEqual from 'lodash/isEqual';
import {useRef, useEffect, EffectCallback, DependencyList} from 'react';

function useDeepCompareMemoize(value: unknown) {
  const ref = useRef<unknown>();
  if (!isEqual(value, ref.current)) {
    ref.current = value
  }
  return ref.current
}

/**
 * Identical to React.useEffect except it uses lodash.isEqual to check for dependency changes.
 * @param callback
 * @param dependencies
 */
export function useDeepCompareEffect(callback: EffectCallback, dependencies: DependencyList): void {
  useEffect(
    callback,
    dependencies.map(useDeepCompareMemoize)
  )
}

export default useDeepCompareEffect;
