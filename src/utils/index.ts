export function inRange(value: number, targetValue: number, threshold: number) {
  return Math.abs(value - targetValue) < threshold;
}

export function clamp(number: number, range: [number, number]) {
  return Math.max(range[0], Math.min(number, range[1]))
};

type Rect = { x: number; y: number; width: number; height: number };
export function getBounds(rects: Rect[]): Rect {
  return {
    x: rects[0].x,
    y: rects[0].y,
    width: rects[0].width,
    height: rects[0].height,
  }
}