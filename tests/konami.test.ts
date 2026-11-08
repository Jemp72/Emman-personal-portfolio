import { test } from "node:test";
import assert from "node:assert/strict";
import { createKonamiMatcher } from "../src/three/konami";
const code = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
test("matches only a complete sequence, accepts uppercase, and resets", () => {
  const input = createKonamiMatcher();
  assert.ok(code.slice(0, -1).every((key) => !input(key)));
  assert.equal(input("A"), true);
  assert.equal(input("a"), false);
  assert.equal(code.map(input).at(-1), true);
});
test("recovers after mistakes and overlapping starting arrows", () => {
  const input = createKonamiMatcher();
  for (const key of ["ArrowUp", "ArrowDown", "b", "a"])
    assert.equal(input(key), false);
  input("ArrowUp");
  assert.equal(code.map(input).at(-1), true);
});
