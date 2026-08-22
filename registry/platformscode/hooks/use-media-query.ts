"use client"

import * as React from 'react';

export const PHONE_QUERY = '(max-width: 639px)';

export function useMediaQuery(query: string) {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );

  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
