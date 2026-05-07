let idCounter = 0;

export function stringToFragment(html: string): DocumentFragment {
  return document.createRange().createContextualFragment(html);
}

export function generateUniqueId(): number {
  return idCounter++;
}

export const TabIndices = {
  DISABLED: -1,
  ENABLED: 0,
} as const;
