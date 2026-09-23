import { Command } from 'lucide-react'
import { Link } from 'react-router-dom'
import VisionCraftLogo from '../../components/avatar/VisionCraftLogo'
import EmailFormSimple from '../EmailFormSimple'
import { CONFIG } from '../content'
import { useLanguage } from '../useLanguage'

export default function Footer() {
  const year = new Date().getFullYear()
  const { t } = useLanguage()

  const footerColumns = [
    {
      title: t.footer.product,
      links: [
        { label: t.footer.features, href: '#features' },
        { label: t.footer.workflow, href: '#workflow' },
        { label: t.footer.pricing, href: '#pricing' },
        { label: t.footer.download, href: '#download' },
      ],
    },
    {
      title: t.footer.resources,
      links: [
        { label: t.footer.faq, href: '#faq' },
        { label: t.footer.documentation, href: '/docs' },
        { label: t.footer.requirements, href: '/requirements' },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { label: t.footer.privacy, href: '/privacy' },
        { label: t.footer.terms, href: '/terms' },
        { label: t.footer.contact, href: '/contact' },
      ],
    },
  ]

  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer-sub">
          <div className="lp-footer-sub-copy">
            <h4>Stay in the loop</h4>
            <p>Occasional notes on what we're shipping. No spam, unsubscribe any time.</p>
          </div>
          <EmailFormSimple
            endpoint={CONFIG.SUBSCRIBE_ENDPOINT}
            source="newsletter"
            buttonLabel="Subscribe"
            placeholder={t.form.emailPlaceholder}
            successTitle="Subscribed"
            successBody="Thanks — we'll only email when there's something worth your inbox."
            compact
          />
        </div>

        <div className="lp-footer-grid">
          <div className="lp-footer-brand">
            <a className="lp-brand" href="#top" aria-label="VisionCraft home">
              <VisionCraftLogo size={26} />
              VisionCraft
            </a>
            <p className="lp-footer-tagline">{t.footer.tagline}</p>
          </div>

          {footerColumns.map((col) => (
            <div className="lp-footer-col" key={col.title}>
              <h5>{col.title}</h5>
              <ul>
                {col.links.map((link) => {
                  const ext = link.external && /^https?:/.test(link.href)
                  const isInternalPage = link.href.startsWith('/')
                  
                  if (isInternalPage) {
                    return (
                      <li key={link.label}>
                        <Link to={link.href}>{link.label}</Link>
                      </li>
                    )
                  }
                  
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        {...(ext ? { target: '_blank', rel: 'noreferrer' } : {})}
                      >
                        {link.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="lp-footer-bottom">
          <span className="lp-footer-copy">© {year} VisionCraft. All rights reserved.</span>
          <span className="lp-footer-mac">
            <Command size={13} aria-hidden="true" />
            Designed for macOS
          </span>
        </div>
      </div>
    </footer>
  )
}
