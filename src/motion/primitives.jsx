import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
  animate,
} from 'framer-motion'

/* ============================================================================
   Motion primitives
   ----------------------------------------------------------------------------
   Small, composable, and uniformly reduced-motion aware: every one of these
   degrades to a plain static element when the user asks for less motion, and
   none of them animate layout-affecting properties (transform/opacity/clip
   only), so nothing here can thrash the scroll container.
   ========================================================================== */

/* The house easing — matches --ease-enter in index.css. */
export const EASE = [0.16, 1, 0.3, 1]

/* ── MaskText ────────────────────────────────────────────────────────────────
   Words rise out of a clipped line rather than fading in. This is the single
   biggest tell between "animated by a professional" and "opacity: 0 → 1".
   Splitting on words (not characters) keeps it legible and keeps the DOM sane;
   the full string stays readable to screen readers via aria-label. */
export function MaskText({
  text,
  as: Tag = 'span',
  className = '',
  delay = 0,
  stagger = 0.055,
  duration = 0.85,
  accentFrom,
}) {
  const reduced = useReducedMotion()
  const words = String(text).split(' ')

  if (reduced) return <Tag className={className}>{text}</Tag>

  const MotionTag = motion[Tag] ?? motion.span

  return (
    <MotionTag
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.35 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <span className="lp-mask-line" key={`${word}-${i}`} aria-hidden="true">
          <motion.span
            className={`lp-mask-word ${accentFrom !== undefined && i >= accentFrom ? 'lp-accent' : ''}`}
            variants={{
              hidden: { y: '108%', opacity: 0 },
              shown: { y: '0%', opacity: 1 },
            }}
            transition={{ duration, ease: EASE }}
          >
            {word}
          </motion.span>
          {/* No literal space here on purpose: a text node inside the
              overflow:hidden line would collapse or clip unpredictably. Word
              gaps come from .lp-mask-line { margin-right }. */}
        </span>
      ))}
    </MotionTag>
  )
}

/* ── Rise ────────────────────────────────────────────────────────────────────
   The workhorse reveal: a short, springy lift on enter. Replaces the old
   opacity-only .lp-reveal so blocks arrive with intent. */
export function Rise({
  children,
  as: Tag = 'div',
  className = '',
  delay = 0,
  y = 26,
  duration = 0.75,
  amount = 0.25,
  ...rest
}) {
  const reduced = useReducedMotion()
  const MotionTag = motion[Tag] ?? motion.div

  if (reduced) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    )
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

/* ── Magnetic ────────────────────────────────────────────────────────────────
   A CTA that leans toward the cursor. Deliberately subtle (a few px) — the
   point is that the button feels aware of you, not that it moves.
   Note: this is a landing-page-only affordance. The desktop app keeps its
   still-UI rule (hover changes colour, never position). */
export function Magnetic({ children, strength = 0.28, className = '' }) {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 22, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 260, damping: 22, mass: 0.4 })

  if (reduced) return <span className={className}>{children}</span>

  function onMove(e) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  function onLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      className={`lp-magnetic ${className}`.trim()}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.span>
  )
}

/* ── Counter ─────────────────────────────────────────────────────────────────
   Counts up once, when scrolled into view. Writes straight to the DOM node so
   a 60fps count doesn't trigger 60 React renders. */
export function Counter({ to, decimals = 0, duration = 1.5, suffix = '', prefix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduced = useReducedMotion()
  const fixed = Number(to).toFixed(decimals)

  useEffect(() => {
    if (!inView || reduced) return
    const node = ref.current
    if (!node) return
    const controls = animate(0, Number(to), {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        node.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, reduced, to, duration, decimals, prefix, suffix])

  return (
    <span ref={ref}>
      {reduced ? `${prefix}${fixed}${suffix}` : `${prefix}${(0).toFixed(decimals)}${suffix}`}
    </span>
  )
}

/* ── Marquee ─────────────────────────────────────────────────────────────────
   Infinite ticker. The track is duplicated so the CSS translate can loop
   seamlessly; under reduced motion it becomes an ordinary wrapped row. */
export function Marquee({ children, speed = 42, className = '' }) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={`lp-marquee-static ${className}`.trim()}>{children}</div>
  }

  return (
    <div className={`lp-marquee ${className}`.trim()}>
      <div className="lp-marquee-track" style={{ animationDuration: `${speed}s` }}>
        <div className="lp-marquee-group">{children}</div>
        <div className="lp-marquee-group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}

/* ── useTypewriter ───────────────────────────────────────────────────────────
   Types a string out once in view. Used for the confidence read-outs in the
   inference demo, where the text arriving character by character is the point:
   it reads as a model emitting a result. */
export function useTypewriter(text, { speed = 26, start = true } = {}) {
  const reduced = useReducedMotion()
  const [out, setOut] = useState(reduced ? text : '')

  useEffect(() => {
    if (reduced) {
      setOut(text)
      return
    }
    if (!start) {
      setOut('')
      return
    }
    let i = 0
    setOut('')
    const id = setInterval(() => {
      i += 1
      setOut(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed, start, reduced])

  return out
}
