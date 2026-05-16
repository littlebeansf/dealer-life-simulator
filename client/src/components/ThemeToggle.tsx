import { useTheme } from '../hooks/useTheme';

interface Props {
  className?: string;
}

export default function ThemeToggle({ className = '' }: Props) {
  const { theme, toggle } = useTheme();

  return (
    <button
      data-testid="btn-theme-toggle"
      onClick={toggle}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`w-8 h-8 flex items-center justify-center border border-border bg-card hover:bg-secondary transition-colors text-base ${className}`}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
