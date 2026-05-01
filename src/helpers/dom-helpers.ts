let idCounter = 0;

export function stringToFragment(html: string): DocumentFragment {
  return document.createRange().createContextualFragment(html);
}

export function generateRandomId(): number {
  return idCounter++;
}
