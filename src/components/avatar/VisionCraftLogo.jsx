import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * The VisionCraft mark: Depth.
 *
 * One arm of the V sits on the focal plane and is solid. The other arm is behind
 * it, so it arrives as separated slices that fade toward the far end — depth of
 * field drawn as geometry instead of a blur filter. It is the app's own exploded
 * focal stack, compressed into a glyph.
 *
 * Geometry is fixed on a 48-unit grid and must not be adjusted: this is the mark
 * that was selected. Source of truth for the same shapes in
 * frontend/public/favicon.svg and build/icon.iconset/.
 *
 * Four flat fills, one colour, no gradient / glow / inner highlight / drop
 * shadow. Value comes only from fill-opacity, which is what makes the mark
 * correct in a single ink, on white, and inside a macOS tile without a second
 * artwork file.
 */

const FOCAL_ARM = 'M6 8L16 8L28 40L18 40Z';
const SLICES = [
  { d: 'M32 8L42 8L38.7 16.8L28.7 16.8Z', o: 0.42 },
  { d: 'M27.8 19.2L37.8 19.2L34.5 28L24.5 28Z', o: 0.71 },
  { d: 'M23.6 30.4L33.6 30.4L30.3 39.2L20.3 39.2Z', o: 1 },
];

export default function VisionCraftLogo({
  size = 80,
  loginAnimation = false,
  className = '',
  monochrome = false,
}) {
  const reduceMotion = useReducedMotion();

  // Only the busy state animates, and it animates the thing the mark is about:
  // the far arm's slices resolve in sequence, like a focal stack collapsing. The
  // old `animated` prop drove an endless brightness pulse on a logo that was not
  // communicating anything, which is the loudest template tell, so it is gone
  // along with two other props no caller ever passed (layoutId,
  // transitionAnimation).
  const resolving = loginAnimation && !reduceMotion;

  return (
    <span
      className={className}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        // monochrome inherits the surrounding text colour, so the mark dims and
        // brightens with its own label instead of being pinned to one grey.
        color: monochrome ? 'currentColor' : 'var(--accent, #00e5ff)',
      }}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="VisionCraft"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <path d={FOCAL_ARM} fill="currentColor" />
        {SLICES.map(({ d, o }, i) =>
          resolving ? (
            <motion.path
              key={d}
              d={d}
              fill="currentColor"
              initial={{ fillOpacity: o }}
              animate={{ fillOpacity: [o, Math.min(1, o + 0.34), o] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.16,
              }}
            />
          ) : (
            <path key={d} d={d} fill="currentColor" fillOpacity={o} />
          )
        )}
      </svg>
    </span>
  );
}

VisionCraftLogo.propTypes = {
  size: PropTypes.number,
  /** Resolves the far arm's slices in sequence while a request is in flight. */
  loginAnimation: PropTypes.bool,
  className: PropTypes.string,
  /** Render in the inherited text colour instead of the brand accent. */
  monochrome: PropTypes.bool,
};
