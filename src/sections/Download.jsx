import { Download as DownloadIcon, Check, Command, ArrowRight } from 'lucide-react'
import { Reveal } from '../Reveal'
import { REQUIREMENTS, CONFIG } from '../content'

/* Download + system requirements. macOS is the live platform; Windows and
   Linux are shown as dashed "coming soon" cards. If no DOWNLOAD_URL is set,
   the button stays but a mono note says so — no silently-dead control. */
export default function Download() {
  const hasUrl = Boolean(CONFIG.DOWNLOAD_URL)
  const meta = ['macOS', `v${CONFIG.VERSION}`, CONFIG.DMG_SIZE].filter(Boolean).join(' · ')

  return (
    <section className="lp-section" id="download">
      <div className="lp-container">
        <div className="lp-download-grid">
          <Reveal>
            <p className="lp-eyebrow">Download</p>
            <h2 className="lp-section-title">Get VisionCraft for macOS</h2>
            <p className="lp-section-lead">
              A single signed app — the agent, the local backend, the training queue, and the model
              store, all bundled. No separate services to install.
            </p>

            <div className="lp-hero-ctas">
              <a
                className="lp-btn lp-btn-primary lp-btn-lg"
                href={hasUrl ? CONFIG.DOWNLOAD_URL : '#download'}
                {...(hasUrl ? { download: true } : {})}
              >
                <DownloadIcon size={18} aria-hidden="true" />
                Download for macOS
              </a>
              <a className="lp-btn lp-btn-secondary lp-btn-lg" href="#waitlist">
                Join the waitlist
                <ArrowRight size={17} aria-hidden="true" />
              </a>
            </div>

            <p className="lp-meta-note">{meta}</p>
            {!hasUrl && (
              <p className="lp-form-demo" style={{ maxWidth: 340 }}>
                demo mode · set CONFIG.DOWNLOAD_URL to link the real .dmg
              </p>
            )}
          </Reveal>

          <Reveal className="lp-req-card">
            <div className="lp-req-platform">
              <Command size={20} aria-hidden="true" />
              <h3>{REQUIREMENTS.available.platform}</h3>
            </div>
            <ul className="lp-req-list">
              {REQUIREMENTS.available.items.map((item) => (
                <li key={item}>
                  <Check size={16} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="lp-soon-row">
              {REQUIREMENTS.soon.map((s) => (
                <div className="lp-soon" key={s.platform}>
                  <span className="lp-soon-name">{s.platform}</span>
                  <span className="lp-soon-note">{s.note}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
