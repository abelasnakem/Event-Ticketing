import { createTheme } from '@mantine/core';
import type { MantineColorsTuple } from '@mantine/core';

const nightfall: MantineColorsTuple = [
  '#f9ffe0',
  '#f5ffc2',
  '#f0ff8a',
  '#ebff54',
  '#eaff00',
  '#d3e600',
  '#b7c900',
  '#9bac00',
  '#7a8900',
  '#5e6a00',
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
