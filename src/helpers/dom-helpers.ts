export function stringToFragment(html: string): DocumentFragment {
  return document.createRange().createContextualFragment(html);
}
