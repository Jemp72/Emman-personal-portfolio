export const PIXELS_PER_HOP = 120;
export const isRoad = (row: number) => row > 1 && row % 6 >= 2 && row % 6 <= 4;
export const scrollDestination = (pixels: number) =>
  Math.round(
    Math.max(0, Number.isFinite(pixels) ? pixels : 0) / PIXELS_PER_HOP,
  );
// Only a moving window of terrain is retained, even after thousands of hops.
export function visibleRows(row: number) {
  const center = Math.floor(row);
  return { first: center - 18, last: center + 30 };
}
function randomLane(seed: number, row: number, salt: number) {
  let n = Math.imul((seed ^ Math.imul(row, 374761393) ^ salt) >>> 0, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}
export function traffic(row: number, seed = 0) {
  const level = Math.min(1, Math.max(0, row) / 100);
  return {
    direction: randomLane(seed, row, 11) < 0.5 ? -1 : 1,
    speed: 0.85 + randomLane(seed, row, 37) * 0.9 + level * 1.4,
    count:
      row < 12
        ? 2
        : randomLane(seed, row, 71) < 0.3
          ? 1
          : randomLane(seed, row, 97) < level * 0.65
            ? 3
            : 2,
    phase: randomLane(seed, row, 131) * 18,
  };
}
export function carX(row: number, time: number, index = 0, seed = 0) {
  const lane = traffic(row, seed);
  const offset =
    (index * 18) / lane.count +
    (randomLane(seed, row, index + 173) - 0.5) * 1.2;
  return (
    ((((time * lane.speed * lane.direction + lane.phase + offset) % 18) + 18) %
      18) -
    9
  );
}
export type Game = {
  seed: number;
  x: number;
  row: number;
  score: number;
  time: number;
  status: "ready" | "playing" | "paused" | "lost";
  cooldown: number;
};
export const newGame = (seed = 0): Game => ({
  seed,
  x: 0,
  row: 0,
  score: 0,
  time: 0,
  status: "ready",
  cooldown: 0,
});
export function move(g: Game, dx: number, dr: number) {
  if (g.status !== "playing" || g.cooldown > 0) return;
  g.x = Math.max(-4, Math.min(4, g.x + dx));
  g.row = Math.max(0, g.row + dr);
  g.score = Math.max(g.score, g.row);
  g.cooldown = 0.16;
}
export function tick(g: Game, dt: number) {
  if (g.status !== "playing") return;
  dt = Math.max(0, Math.min(0.05, dt));
  g.time += dt;
  g.cooldown = Math.max(0, g.cooldown - dt);
  if (
    isRoad(g.row) &&
    Array.from({ length: traffic(g.row, g.seed).count }, (_, i) => i).some(
      (i) => Math.abs(g.x - carX(g.row, g.time, i, g.seed)) < 0.94,
    )
  )
    g.status = "lost";
}
