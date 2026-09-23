import { createContext, useContext, useState, useEffect } from 'react'
import { translations, languages } from './translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('visioncraft-language')
    if (saved && translations[saved]) return saved
    
    // Check browser language
    const browserLang = navigator.language.split('-')[0]
    if (translations[browserLang]) return browserLang
    
    // Default to English
    return 'en'
  })

  const currentLang = languages.find(l => l.code === language)
  const isRTL = currentLang?.rtl || false

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('visioncraft-language', language)
    
    // Set HTML dir and lang attributes
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language, isRTL])

  const t = translations[language]

  const switchLanguage = (newLang) => {
    if (translations[newLang]) {
      setLanguage(newLang)
    }
  }

  return (
    <LanguageContext.Provider value={{ language, switchLanguage, t, isRTL, languages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
