import { test } from "node:test";
import assert from "node:assert/strict";
import {
  newGame,
  move,
  tick,
  scrollDestination,
  carX,
  visibleRows,
  traffic,
} from "../src/three/game";
test("scroll clamps and reverses without a queue", () => {
  assert.equal(scrollDestination(-2), 0);
  assert.equal(scrollDestination(1200), 10);
  assert.equal(scrollDestination(600), 5);
  assert.equal(scrollDestination(0), 0);
  assert.equal(scrollDestination(NaN), 0);
});
test("ready and paused states do not move; score never decreases", () => {
  const g = newGame();
  move(g, 0, 1);
  assert.equal(g.row, 0);
  g.status = "playing";
  move(g, 0, 1);
  tick(g, 0.2);
  g.cooldown = 0;
  move(g, 0, -1);
  assert.equal(g.score, 1);
  g.status = "paused";
  const before = { ...g };
  tick(g, 100);
  move(g, 1, 0);
  assert.deepEqual(g, before);
});
test("cars collide on roads, not grass; delta is capped", () => {
  const g = newGame();
  g.status = "playing";
  g.row = 2;
  g.x = carX(2, 0.05);
  tick(g, 100);
  assert.equal(g.status, "lost");
  assert.equal(g.time, 0.05);
  const safe = newGame();
  safe.status = "playing";
  safe.x = carX(0, 0.05);
  tick(safe, 0.05);
  assert.equal(safe.status, "playing");
});
test("endless movement and restart", () => {
  const g = newGame();
  g.status = "playing";
  g.row = 35;
  move(g, 0, 1);
  assert.equal(g.status, "playing");
  g.row = 10000;
  g.cooldown = 0;
  move(g, 0, 1);
  assert.equal(g.row, 10001);
  assert.equal(g.score, 10001);
  assert.deepEqual(newGame(), {
    seed: 0,
    x: 0,
    row: 0,
    score: 0,
    time: 0,
    status: "ready",
    cooldown: 0,
  });
});

test("terrain window stays bounded at distant rows", () => {
  for (const row of [0, 36, 10000, 1000000]) {
    const r = visibleRows(row);
    assert.equal(r.last - r.first + 1, 49);
    assert.ok(r.first <= row && r.last >= row);
  }
});

test("seeded traffic varies between runs but remains stable per lane", () => {
  assert.deepEqual(traffic(20, 123), traffic(20, 123));
  assert.notDeepEqual(traffic(20, 123), traffic(20, 456));
  for (let seed = 0; seed < 30; seed++)
    for (let row = 2; row < 150; row++) {
      const t = traffic(row, seed);
      assert.ok(t.speed >= 0.85 && t.speed <= 3.15);
      assert.ok(t.count >= 1 && t.count <= 3);
      const positions = Array.from({ length: t.count }, (_, i) =>
        carX(row, 10, i, seed),
      );
      for (let i = 0; i < positions.length; i++)
        for (let j = i + 1; j < positions.length; j++) {
          const gap = Math.abs(positions[i] - positions[j]);
          assert.ok(Math.min(gap, 18 - gap) > 4);
        }
    }
  const g = newGame(99);
  g.status = "playing";
  g.row = 50;
  g.x = carX(g.row, 0.05, 0, g.seed);
  tick(g, 0.05);
  assert.equal(g.status, "lost");
});
