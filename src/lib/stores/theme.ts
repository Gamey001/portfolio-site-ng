import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'dark' | 'light';

const KEY = 'gd:theme';
const initial: Theme = browser
  ? ((localStorage.getItem(KEY) as Theme) ?? 'light')
  : 'light';

export const theme = writable<Theme>(initial);

if (browser) {
  theme.subscribe((value) => {
    document.documentElement.setAttribute('data-theme', value);
    localStorage.setItem(KEY, value);
  });
}

export function toggleTheme() {
  theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
}
