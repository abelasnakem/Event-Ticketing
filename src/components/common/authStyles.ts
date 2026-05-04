export const AUTH_COLORS = {
  accent: '#d97b2b',
  textPrimary: '#f7f3ec',
  textMuted: '#bdb6ab',
  inputBg: '#f1efe9',
  inputBorder: '#ded9d0',
  inputText: '#1b1b1b',
  buttonBg: '#ead9c5',
  buttonHover: '#f0e2d2',
};

export const inputStyles = {
  input: {
    backgroundColor: AUTH_COLORS.inputBg,
    borderColor: AUTH_COLORS.inputBorder,
    color: AUTH_COLORS.inputText,
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)',
    '&::placeholder': {
      color: '#8e877d',
    },
  },
  label: {
    color: AUTH_COLORS.textMuted,
    fontWeight: 600,
    marginBottom: 6,
  },
};

export const buttonStyles = {
  root: {
    backgroundColor: AUTH_COLORS.buttonBg,
    color: '#1b1b1b',
    fontWeight: 600,
    boxShadow: '0 10px 24px rgba(0, 0, 0, 0.35)',
    '&:hover': {
      backgroundColor: AUTH_COLORS.buttonHover,
    },
  },
};

export const progressStyles = {
  root: {
    backgroundColor: '#2a2a2a',
  },
  section: {
    backgroundColor: AUTH_COLORS.accent,
  },
};

export const passwordRequirements = [
  (value: string) => value.length >= 8,
  (value: string) => /[A-Z]/.test(value),
  (value: string) => /[a-z]/.test(value),
  (value: string) => /\d/.test(value),
  (value: string) => /[^A-Za-z0-9]/.test(value),
];

export function getPasswordStrength(value: string) {
  const metCount = passwordRequirements.reduce((count, requirement) => count + Number(requirement(value)), 0);
  const score = Math.round((metCount / passwordRequirements.length) * 100);
  let label = 'Weak';
  if (score >= 80) {
    label = 'Strong';
  } else if (score >= 60) {
    label = 'Good';
  } else if (score >= 40) {
    label = 'Fair';
  }

  return {
    score,
    metCount,
    label,
  };
}
