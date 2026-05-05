import { createTheme, rgba, type BadgeProps, type ButtonProps, type MantineColorsTuple, type MantineTheme } from '@mantine/core';

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
  primaryShade: { light: 4, dark: 4 },
  colors: {
    nightfall,
  },
  components: {
    Button: {
      styles: (theme: MantineTheme, props: ButtonProps) => {
        const variant = props.variant ?? 'filled';
        const effectiveColor = props.color ?? theme.primaryColor;
        const isNightfall = effectiveColor === 'nightfall';

        return {
          root: isNightfall && variant === 'filled'
            ? { color: theme.black }
            : {},
        };
      },
    },
    Badge: {
      styles: (theme: MantineTheme, props: BadgeProps) => {
        const variant = props.variant ?? 'light';
        const colorName = props.color ?? theme.primaryColor;
        const palette = theme.colors[colorName] ?? theme.colors[theme.primaryColor];
        const base = palette[4] ?? palette[6] ?? theme.black;
        const isBright = colorName === 'nightfall' || colorName === 'yellow';

        return {
          root: {
            backgroundColor: variant === 'filled' ? base : rgba(base, 0.18),
            border: variant === 'filled' ? '1px solid transparent' : `1px solid ${rgba(base, 0.45)}`,
            color: isBright ? theme.black : theme.white,
            borderRadius: 999,
            fontWeight: 600,
            letterSpacing: '0.02em',
            height: 28,
            paddingInline: 12,
            boxShadow: variant === 'filled'
              ? '0 10px 24px rgba(3, 7, 18, 0.35)'
              : 'inset 0 0 0 1px rgba(255, 255, 255, 0.04)',
          },
        };
      },
    },
  },
  fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif",
  headings: {
    fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif",
    fontWeight: '600',
  },
  defaultRadius: 'lg',
});
