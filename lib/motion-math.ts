/** Wraps a marquee offset into [-width, 0) so the duplicated row loops seamlessly. */
export function wrapOffset(x: number, width: number) {
  return ((((x % width) + width) % width) - width);
}
