export type Theme = 'dark' | 'light';

export const toggleTheme = (theme: Theme): Theme => {
  return theme === 'dark' ? 'light' : 'dark';
};

export const applyTheme = (theme: Theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};