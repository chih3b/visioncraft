import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import VisionCraftLogo from '../components/avatar/VisionCraftLogo'
import { CONFIG } from '../content'
import { useLanguage } from '../useLanguage'
import LanguageSelector from '../LanguageSelector'

export default function Nav() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const navRef = useRef(null)

  const NAV_LINKS = [
    { label: t.nav.features, href: '#showcase' },
    { label: t.nav.features, href: '#features' },
  ]

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (open && navRef.current && !navRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [open])

  // Close menu on escape key
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape' && open) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header ref={navRef} className={`lp-nav ${open ? 'open' : ''}`}>
      <div className="lp-container lp-nav-inner">
        <a 
          className="lp-brand" 
          href="#top" 
          aria-label="VisionCraft home"
          onClick={() => setOpen(false)}
        >
          <VisionCraftLogo size={26} />
          VisionCraft
        </a>

        <nav aria-label="Primary">
          <ul className="lp-nav-links" id="lp-primary-nav">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a 
                  className="lp-nav-link" 
                  href={link.href} 
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lp-nav-actions">
          <LanguageSelector />
          <a
            className="lp-btn lp-btn-primary lp-btn-nav"
            href="#top"
            onClick={() => setOpen(false)}
          >
            {t.nav.joinWaitlist}
          </a>
          <button
            type="button"
            className="lp-nav-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="lp-primary-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  )
}
