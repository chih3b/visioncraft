import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { EASE } from '../motion/primitives'
import { useLanguage } from '../useLanguage'

/* ============================================================================
   Showcase — Large images with scroll-triggered animations
   Think Apple product pages: big image, short text, smooth reveals
   ========================================================================== */

export default function Showcase() {
  const reduced = useReducedMotion()
  const { t } = useLanguage()

  const SCREENSHOTS = [
    {
      id: 'agent',
      image: '/images/screenshots/agent.png',
    },
    {
      id: 'training',
      image: '/images/screenshots/training.png',
    },
    {
      id: 'datasets',
      image: '/images/screenshots/dataset.png',
    },
    {
      id: 'marketplace',
      image: '/images/screenshots/models.png',
    },
    {
      id: 'monitoring',
      image: '/images/screenshots/deployment.png',
    }
  ]

  return (
    <section className="lp-showcase" id="showcase">
      {SCREENSHOTS.map((shot, index) => (
        <ShowcaseItem 
          key={shot.id} 
          shot={shot} 
          index={index}
          reduced={reduced}
          content={t.showcase.items[index]}
        />
      ))}
    </section>
  )
}

function ShowcaseItem({ shot, index, reduced, content }) {
  const ref = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  // Parallax: image moves slower than text  
  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50])
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 0.98])
  // Fixed opacity - always visible, slight fade at edges
  const imageOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.8, 1, 1, 0.8])

  return (
    <div ref={ref} className="lp-showcase-item">
      <div className="lp-container">
        {/* Text content */}
        <motion.div 
          className="lp-showcase-text"
          initial={reduced ? false : { opacity: 0, y: 40 }}
          whileInView={reduced ? false : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div className="lp-showcase-number">{String(index + 1).padStart(2, '0')}</div>
          <h2 className="lp-showcase-title">
            {content.title}
            <br />
            <span className="lp-showcase-subtitle">{content.subtitle}</span>
          </h2>
          <p className="lp-showcase-desc">{content.description}</p>
        </motion.div>

        {/* Large image with parallax */}
        <motion.div 
          className="lp-showcase-image-wrapper"
          style={reduced ? {} : { 
            y: imageY,
            scale: imageScale,
            opacity: imageOpacity
          }}
        >
          <div className="lp-showcase-image">
            <img 
              src={shot.image} 
              alt={`${content.title} - ${content.subtitle}`}
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div className="lp-showcase-placeholder" style={{ display: 'none' }}>
              <div className="lp-placeholder-box">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <p>Screenshot: {shot.image}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
