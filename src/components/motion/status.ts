'use client';

import { useSyncExternalStore } from 'react';

/**
 * A tiny message bus for the status bar on the home page.
 * Any animated element can report what it is doing, and the bar prints the latest line.
 */
let current = 'ready';
const listeners = new Set<() => void>();

export function setStatus(text: string) {
  if (text === current) return;
  current = text;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useStatus(): string {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => 'ready',
  );
}
