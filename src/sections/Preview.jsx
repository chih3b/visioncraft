import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductPreview from './ProductPreview'
import { Rise } from '../motion/primitives'

/* The real app window, on its own stage. It arrives tilted away in 3D and
   rotates flat as it enters — the same "lifting into place" language as the
   depth field, so the page reads as one idea rather than a pile of effects.
   The mode tabs inside stay fully interactive.

   Exploded view: the four real columns lift apart along Z into parallel glass
   planes you can orbit by dragging (or with the arrow keys), with a
   depth-of-field blur on the planes away from focus — a literal optical read
   for a computer-vision tool. It collapses back to the assembled app. The
   whole affordance is withheld under reduced motion. */
export default function Preview() {
  const [exploded, setExploded] = useState(false)

  return (
    <section className="lp-section lp-preview-section" id="preview" style={{ paddingBottom: '120px' }}>
      <div className="lp-container">
        <Rise className="lp-preview-controls" delay={0.05} style={{ marginBottom: '24px' }}>
          <ViewToggle exploded={exploded} onChange={setExploded} />
          {exploded && (
            <p className="lp-preview-hint" aria-hidden="true">
              Drag to rotate — or focus the frame and use the arrow keys
            </p>
          )}
        </Rise>
      </div>

      <div className="lp-preview-stage" style={{ transform: 'scale(0.85)', transformOrigin: 'top center', marginTop: '-40px' }}>
        <motion.div
          className="lp-preview-tilt"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <ProductPreview exploded={exploded} scrollProgress={null} />
        </motion.div>
      </div>
    </section>
  )
}

/* A two-state segmented control. Both options are real buttons with
   aria-pressed, so it's operable and legible to a screen reader; the active
   thumb is a separate layer that slides between them. */
function ViewToggle({ exploded, onChange }) {
  return (
    <div className="lp-view-toggle" role="group" aria-label="App preview view">
      <span className={`lp-view-thumb ${exploded ? 'is-right' : ''}`} aria-hidden="true" />
      <button
        type="button"
        className={`lp-view-opt ${!exploded ? 'active' : ''}`}
        aria-pressed={!exploded}
        onClick={() => onChange(false)}
      >
        Assembled
      </button>
      <button
        type="button"
        className={`lp-view-opt ${exploded ? 'active' : ''}`}
        aria-pressed={exploded}
        onClick={() => onChange(true)}
      >
        Exploded
      </button>
    </div>
  )
}
