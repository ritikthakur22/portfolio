/** Keeps a square of `size` px fully on screen with `margin` px to spare. */
export function clampPosition(x: number, y: number, vw: number, vh: number, size = 64, margin = 8) {
  return {
    x: Math.max(margin, Math.min(vw - size - margin, x)),
    y: Math.max(margin, Math.min(vh - size - margin, y)),
  };
}
