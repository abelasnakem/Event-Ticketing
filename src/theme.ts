import { createTheme } from '@mantine/core';
import type { MantineColorsTuple } from '@mantine/core';

const nightfall: MantineColorsTuple = [
  '#edf2ff',
  '#d2dafe',
  '#a4b5fb',
  '#768ffa',
  '#536ff7',
  '#3d58f5',
  '#314ef4',
  '#2742da',
  '#1f3ac2',
  '#122aa2',
];

export const appTheme = createTheme({
  primaryColor: 'nightfall',
  colors: {
    nightfall,
  },
  fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif",
  headings: {
    fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif",
    fontWeight: '600',
  },
  defaultRadius: 'lg',
});
