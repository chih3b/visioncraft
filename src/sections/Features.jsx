import { motion, useReducedMotion } from 'framer-motion'
import { Bot, HardDrive, KeyRound, Boxes, Cpu, Radio } from 'lucide-react'
import { Rise, MaskText, EASE } from '../motion/primitives'
import { useLanguage } from '../useLanguage'

/* Icon strings in content.js map to real lucide components here, so copy stays
   editable without touching imports. Cards reveal in a stagger rather than all
   at once, and each carries a mono index so the grid reads as a catalogue
   rather than six identical boxes. Simple hover state only - no 3D tricks. */
const ICONS = { Bot, HardDrive, KeyRound, Boxes, Cpu, Radio }

function FeatureCard({ f, index }) {
  const Icon = ICONS[f.icon] ?? Bot

  return (
    <motion.article
      className="lp-feature"
      variants={{
        hidden: { opacity: 0, y: 24 },
        shown: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <span className="lp-feature-top">
        <span className="lp-feature-icon" aria-hidden="true">
          <Icon size={19} />
        </span>
        <span className="lp-feature-index" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
      </span>
      
      <div>
        <h3>{f.title}</h3>
        <p>{f.body}</p>
      </div>
    </motion.article>
  )
}

export default function Features() {
  const reduced = useReducedMotion()
  const { t } = useLanguage()

  return (
    <section className="lp-section" id="features">
      <div className="lp-container">
        <Rise className="lp-head-block">
          <p className="lp-eyebrow">Capabilities</p>
          <MaskText
            as="h2"
            className="lp-section-title"
            text={t.features.title}
          />
          <p className="lp-section-lead">
            Sourcing, training, evaluation, deployment, and monitoring — driven by an agent that
            explains what it is doing at each step, and runs entirely on your machine.
          </p>
        </Rise>

        <motion.div
          className="lp-feature-grid"
          initial={reduced ? false : 'hidden'}
          whileInView={reduced ? false : 'shown'}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ staggerChildren: 0.08 }}
        >
          {t.features.items.map((f, i) => (
            <FeatureCard key={f.title} f={{ ...f, icon: ['Bot', 'HardDrive', 'KeyRound', 'Boxes', 'Cpu', 'Radio'][i] }} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
