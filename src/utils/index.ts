export function inRange(value: number, targetValue: number, threshold: number) {
  return Math.abs(value - targetValue) < threshold;
}

export function clamp(number: number, range: [number, number]) {
  return Math.max(range[0], Math.min(number, range[1]))
};