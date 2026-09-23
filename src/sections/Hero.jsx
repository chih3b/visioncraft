import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from '../motion/primitives'
import { CONFIG } from '../content'
import EmailFormSimple from '../EmailFormSimple'
import { useLanguage } from '../useLanguage'

/* ============================================================================
   Hero — Bold, clean, no clutter
   ========================================================================== */

export default function Hero() {
  const reduced = useReducedMotion()
  const { t } = useLanguage()

  return (
    <section className="lp-hero" id="top">
      <div className="lp-container lp-hero-inner">
        <motion.div
          className="lp-hero-content"
          initial={reduced ? false : { opacity: 0, y: 30 }}
          animate={reduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <h1 className="lp-hero-title">
            {t.hero.titleLead}
            <br />
            <span className="lp-hero-accent">{t.hero.titleAccent}</span>
          </h1>

          <p className="lp-hero-sub">
            {t.hero.subhead}
          </p>

          <div className="lp-hero-waitlist-form">
            <EmailFormSimple
              endpoint={CONFIG.WAITLIST_ENDPOINT}
              source="hero-waitlist"
              buttonLabel={t.form.submit}
              placeholder={t.form.emailPlaceholder}
              successTitle={t.form.successTitle}
              successBody={t.form.successBody}
              compact={false}
            />
          </div>

          <p className="lp-hero-status">
            <span className="lp-status-dot"></span>
            {t.hero.status}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
