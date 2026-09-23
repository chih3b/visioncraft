import Reticle from '../Reticle'
import EmailForm from '../EmailForm'
import { CONFIG } from '../content'

/* The primary conversion band. Framed by the reticle to tie the waitlist back
   to the product's visual language. The form carries all four states; when no
   endpoint is configured it runs in honest demo mode. */
export default function Waitlist() {
  return (
    <section className="lp-section lp-waitlist" id="waitlist">
      <div className="lp-container">
        <Reticle>
          <div style={{ padding: '8px 0' }}>
            <p className="lp-eyebrow" style={{ justifyContent: 'center' }}>
              Waitlist
            </p>
            <h2 className="lp-section-title">Join the waitlist</h2>
            <p className="lp-section-lead">
              Get early access when we launch. We will keep you updated on progress and notify you
              the moment VisionCraft is ready for you.
            </p>
            <div style={{ marginTop: 28 }}>
              <EmailForm
                endpoint={CONFIG.WAITLIST_ENDPOINT}
                source="waitlist"
                buttonLabel="Join the waitlist"
                successTitle="You are on the list"
                successBody="We will email you the moment there is something new to try."
                consent="No spam. Unsubscribe any time. We only email about VisionCraft."
              />
            </div>
          </div>
        </Reticle>
      </div>
    </section>
  )
}
