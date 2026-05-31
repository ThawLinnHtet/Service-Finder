export const normalizeStringList = (items: string[]): string[] => {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const item of items) {
    const value = item.trim();
    if (!value) {
      continue;
    }

    const key = value.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    normalized.push(value);
  }

  return normalized;
};
