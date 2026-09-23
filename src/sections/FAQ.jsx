import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Reveal } from '../Reveal'
import { FAQS } from '../content'

/* Accessible disclosure accordion. Each question is a real button with
   aria-expanded / aria-controls; answers stay in the DOM and animate open via
   max-height (a transform-free reveal, per the still-UI rule). Items toggle
   independently. */
export default function FAQ() {
  const [open, setOpen] = useState(() => new Set())

  const toggle = (i) =>
    setOpen((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })

  return (
    <section className="lp-section" id="faq">
      <div className="lp-container">
        <div className="lp-faq-grid">
          <Reveal>
            <p className="lp-eyebrow">FAQ</p>
            <h2 className="lp-section-title">Questions, answered</h2>
            <p className="lp-section-lead">
              Still curious about something? Join the waitlist and reply to the welcome email —
              it reaches a human.
            </p>
          </Reveal>

          <div className="lp-faq-list">
            {FAQS.map((item, i) => {
              const isOpen = open.has(i)
              const panelId = `lp-faq-panel-${i}`
              const btnId = `lp-faq-q-${i}`
              return (
                <div className="lp-faq-item" key={i} data-open={isOpen ? 'true' : 'false'}>
                  <button
                    type="button"
                    className="lp-faq-q"
                    id={btnId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(i)}
                  >
                    {item.q}
                    <Plus className="lp-faq-icon" size={18} aria-hidden="true" />
                  </button>
                  <div className="lp-faq-a" id={panelId} role="region" aria-labelledby={btnId}>
                    <div className="lp-faq-a-inner">{item.a}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
