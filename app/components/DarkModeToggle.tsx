'use client';

import { useTheme } from './ThemeProvider';

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{ backgroundColor: isDark ? '#6366f1' : 'var(--border)' }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform"
        style={{ transform: isDark ? 'translateX(1.25rem)' : 'translateX(0)' }}
      />
    </button>
  );
}
