/**
 * Dark hero card surface with brand glows (home, about).
 * The glows are radial gradients on the card itself instead of blurred child elements:
 * children with `filter: blur()` escape the rounded `overflow-hidden` clip in Safari/iOS (and some GPU paths),
 * which left a hard, square top-right corner next to the glow.
 */
export const heroSurfaceClassName =
  'relative isolate overflow-hidden rounded-3xl bg-[#0b1220] bg-[radial-gradient(22rem_22rem_at_calc(100%+1rem)_-1rem,rgb(5_150_105/0.42),transparent_70%),radial-gradient(22rem_20rem_at_40%_calc(100%+5rem),rgb(14_165_233/0.2),transparent_70%)] text-white shadow-lg';
