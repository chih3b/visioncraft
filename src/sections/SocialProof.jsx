import { Reveal } from '../Reveal'
import { TESTIMONIALS } from '../content'

/* Social-proof scaffold. There are no real testimonials yet, so the warning
   banner stays and the names read "Placeholder name" on purpose — nothing here
   should be published as-is. Replace with real, consented quotes. */
export default function SocialProof() {
  return (
    <section className="lp-section" id="social-proof">
      <div className="lp-container">
        <Reveal className="lp-head-block">
          <p className="lp-eyebrow">Social proof</p>
          <h2 className="lp-section-title">Built for people who ship models</h2>
        </Reveal>

        <p className="lp-price-note">{TESTIMONIALS.note}</p>

        <Reveal className="lp-quotes">
          {TESTIMONIALS.items.map((t, i) => (
            <figure className="lp-quote" key={i}>
              <blockquote>
                <p>“{t.quote}”</p>
              </blockquote>
              <figcaption className="lp-quote-by">
                <span className="lp-quote-name">{t.name}</span>
                <span className="lp-quote-role">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
