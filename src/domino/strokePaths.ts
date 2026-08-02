/**
 * Generates the 10 hand-drawn tally-mark stroke paths for one DominoX block.
 *
 * Traditional domino tally scoring: a 50-point block is two "box + diagonal"
 * groups of 5 strokes each (4 sides of a box, then a diagonal stroke crossing
 * it out) — the domino player's equivalent of a five-bar gate tally. Each
 * stroke is a slightly bowed, slightly jittered quadratic curve instead of a
 * perfectly straight vector line, so the block reads as graphite on paper
 * rather than a rendered icon.
 *
 * Geometry is deterministic for a given `size` (seeded PRNG) so re-renders
 * never reflow the strokes mid-animation.
 */

interface Point {
  x: number;
  y: number;
}

/** Small deterministic PRNG (mulberry32) — stable jitter, no external deps. */
function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One imperfect hand-drawn stroke from p0 to p1, as an SVG path `d` string. */
function drawnLine(p0: Point, p1: Point, rnd: () => number, jitter: number, bow: number): string {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;

  const x0 = p0.x + (rnd() - 0.5) * jitter;
  const y0 = p0.y + (rnd() - 0.5) * jitter;
  const x1 = p1.x + (rnd() - 0.5) * jitter;
  const y1 = p1.y + (rnd() - 0.5) * jitter;

  const bowAmount = (rnd() - 0.5) * 2 * bow;
  const mx = (x0 + x1) / 2 + nx * bowAmount;
  const my = (y0 + y1) / 2 + ny * bowAmount;

  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} Q ${mx.toFixed(2)} ${my.toFixed(2)} ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

/**
 * Builds the 10 stroke paths (in draw order) for a `size` x `size` DominoX
 * block: strokes 0-4 form the first 5-mark tally group (25 points), strokes
 * 5-9 form the second (another 25 points) — 10 strokes / 50 points total.
 */
export function buildBlockStrokePaths(size: number): string[] {
  const rnd = mulberry32(Math.round(size * 97) + 12345);

  const pad = size * 0.16;
  const gap = size * 0.1;
  const innerW = size - pad * 2;
  const innerH = size - pad * 2;
  const groupW = (innerW - gap) / 2;
  const groupH = innerH;
  const jitter = Math.max(1, size * 0.018);
  const bow = Math.max(1.5, size * 0.03);

  const paths: string[] = [];

  for (let g = 0; g < 2; g++) {
    const gx = pad + g * (groupW + gap);
    const gy = pad;
    const tl: Point = { x: gx, y: gy };
    const tr: Point = { x: gx + groupW, y: gy };
    const br: Point = { x: gx + groupW, y: gy + groupH };
    const bl: Point = { x: gx, y: gy + groupH };

    paths.push(drawnLine(tl, tr, rnd, jitter, bow)); // top
    paths.push(drawnLine(tr, br, rnd, jitter, bow)); // right
    paths.push(drawnLine(br, bl, rnd, jitter, bow)); // bottom
    paths.push(drawnLine(bl, tl, rnd, jitter, bow)); // left
    paths.push(drawnLine(tl, br, rnd, jitter, bow * 1.4)); // diagonal cross-out
  }

  return paths;
}
