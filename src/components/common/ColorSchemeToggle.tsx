import { ActionIcon, rem, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';

export type ColorSchemeToggleProps = {
  size?: number | string;
  radius?: number | string;
  darkColor?: string;
  lightColor?: string;
};

export default function ColorSchemeToggle({
  size = rem(40),
  radius = 'lg',
  darkColor = 'blue',
  lightColor = 'yellow',
}: ColorSchemeToggleProps) {
  const { setColorScheme } = useMantineColorScheme();
  const computedScheme = useComputedColorScheme('dark');

  const nextScheme = computedScheme === 'dark' ? 'light' : 'dark';

  return (
    <ActionIcon
      size={size}
      radius={radius}
      variant="light"
      color={computedScheme === 'dark' ? lightColor : darkColor}
      onClick={() => setColorScheme(nextScheme)}
      aria-label="Toggle color scheme"
    >
      {computedScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
    </ActionIcon>
  );
}
