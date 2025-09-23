import type { Theme } from '../types';

export function applyTheme(theme: Theme) {
  const root = document.documentElement;

  // Remove any existing theme classes
  root.classList.remove('dark');

  if (theme === 'dark') {
    root.classList.add('dark');
  } else if (theme === 'system') {
    // Check system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (systemPrefersDark) {
      root.classList.add('dark');
    }
  }
  // 'light' theme doesn't need a class (default)
}

export function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function watchSystemTheme(callback: (theme: 'light' | 'dark') => void) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light');
  };

  mediaQuery.addEventListener('change', handleChange);

  // Return cleanup function
  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
}