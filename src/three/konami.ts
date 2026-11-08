const sequence = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

export function createKonamiMatcher() {
  let recent: string[] = [];
  return (key: string) => {
    recent = [...recent, key.toLowerCase()].slice(-sequence.length);
    const complete =
      recent.length === sequence.length &&
      recent.every((value, i) => value === sequence[i]);
    if (complete) recent = [];
    return complete;
  };
}
