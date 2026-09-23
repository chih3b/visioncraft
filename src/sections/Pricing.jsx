import { Check } from 'lucide-react'
import { Reveal } from '../Reveal'
import { PRICING, CONFIG } from '../content'

/* Three tiers. The featured tier gets the accent treatment; every card is the
   same height so the CTAs line up. Prices are placeholders — see the warning
   banner, which stays visible until real numbers replace them. */
export default function Pricing() {
  const downloadHref = CONFIG.DOWNLOAD_URL || '#download'

  const ctaFor = (kind) => {
    if (kind === 'download') return { href: downloadHref, ...(CONFIG.DOWNLOAD_URL ? { download: true } : {}) }
    if (kind === 'contact') return { href: 'mailto:hello@visioncraft.ai' }
    return { href: '#waitlist' }
  }

  return (
    <section className="lp-section" id="pricing">
      <div className="lp-container">
        <Reveal className="lp-head-block">
          <p className="lp-eyebrow">Pricing</p>
          <h2 className="lp-section-title">Free while we’re in preview</h2>
          <p className="lp-section-lead">
            The full app is free during the public preview. Paid tiers below are a preview of what’s
            coming — join the waitlist to be first in line.
          </p>
        </Reveal>

        <p className="lp-price-note">{PRICING.note}</p>

        <div className="lp-price-grid">
          {PRICING.tiers.map((tier) => {
            const cta = ctaFor(tier.kind)
            return (
              <article
                className={`lp-tier ${tier.featured ? 'lp-tier-featured' : ''}`}
                key={tier.name}
              >
                {tier.featured && <span className="lp-tier-badge">Most popular</span>}
                <h3 className="lp-tier-name">{tier.name}</h3>
                <div className="lp-tier-price">
                  <span className="lp-tier-amount">{tier.price}</span>
                  <span className="lp-tier-cadence">{tier.cadence}</span>
                </div>
                <p className="lp-tier-tagline">{tier.tagline}</p>
                <ul className="lp-tier-features">
                  {tier.features.map((f) => (
                    <li key={f}>
                      <Check size={16} aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  className={`lp-btn lp-btn-block ${tier.featured ? 'lp-btn-primary' : 'lp-btn-secondary'}`}
                  {...cta}
                >
                  {tier.cta}
                </a>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
