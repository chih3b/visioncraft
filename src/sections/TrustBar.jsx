import { Marquee } from '../motion/primitives'
import { PROVIDERS } from '../content'

/* An infinite ticker instead of a static row: it reads as a live list of
   integrations rather than a logo wall, and it needs no third-party marks.
   Duplicated track + CSS translate; the copy is aria-hidden so the list is
   announced once. Reduced motion collapses it to a wrapped row. */
export default function TrustBar() {
  return (
    <section className="lp-trust" aria-label="Supported providers">
      <p className="lp-trust-label">Runs on the keys you already have</p>
      <Marquee speed={38}>
        {PROVIDERS.map((p) => (
          <span className="lp-chip" key={p.name}>
            {p.name}
            {p.tag && <span className="lp-chip-tag">{p.tag}</span>}
          </span>
        ))}
      </Marquee>
    </section>
  )
}
