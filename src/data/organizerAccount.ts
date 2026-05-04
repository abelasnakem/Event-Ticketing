export const ORGANIZER_ACCOUNT_STORAGE_KEY = 'organizer-account';

export type OrganizerAccount = {
  fullName: string;
  businessName: string;
  email: string;
  createdAt: string;
};

export function getOrganizerAccount(): OrganizerAccount | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(ORGANIZER_ACCOUNT_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<OrganizerAccount>;
    if (
      typeof parsed.fullName !== 'string' ||
      typeof parsed.businessName !== 'string' ||
      typeof parsed.email !== 'string' ||
      typeof parsed.createdAt !== 'string'
    ) {
      return null;
    }

    return {
      fullName: parsed.fullName,
      businessName: parsed.businessName,
      email: parsed.email,
      createdAt: parsed.createdAt,
    };
  } catch {
    return null;
  }
}

export function saveOrganizerAccount(account: OrganizerAccount) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(ORGANIZER_ACCOUNT_STORAGE_KEY, JSON.stringify(account));
}

export function clearOrganizerAccount() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(ORGANIZER_ACCOUNT_STORAGE_KEY);
}
