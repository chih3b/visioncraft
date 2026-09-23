import { useState, useRef, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { useLanguage } from './useLanguage'

export default function LanguageSelector() {
  const { language, switchLanguage, languages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentLang = languages.find(l => l.code === language)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="lp-lang-selector" ref={dropdownRef}>
      <button
        className="lp-lang-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Globe size={16} />
        <span className="lp-lang-current">{currentLang?.short}</span>
      </button>

      {isOpen && (
        <div className="lp-lang-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`lp-lang-option ${language === lang.code ? 'active' : ''}`}
              onClick={() => {
                switchLanguage(lang.code)
                setIsOpen(false)
              }}
            >
              <span className="lp-lang-code">{lang.short}</span>
              <span className="lp-lang-name">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
