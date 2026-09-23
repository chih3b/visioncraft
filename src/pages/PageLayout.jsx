import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import VisionCraftLogo from '../components/avatar/VisionCraftLogo'
import { useLanguage } from '../useLanguage'

export default function PageLayout({ title, children }) {
  const { t } = useLanguage()
  
  return (
    <div className="lp-page">
      <span className="lp-grain" aria-hidden="true" />
      
      <header className="lp-page-header">
        <div className="lp-container lp-page-header-inner">
          <Link to="/" className="lp-page-back">
            <ArrowLeft size={18} />
            <span>{t.pages.backToHome}</span>
          </Link>
          <Link className="lp-brand" to="/" aria-label="VisionCraft home">
            <VisionCraftLogo size={24} />
            <span>VisionCraft</span>
          </Link>
        </div>
      </header>

      <main className="lp-page-main">
        <div className="lp-container">
          <div className="lp-page-header-section">
            <h1 className="lp-page-title">{title}</h1>
          </div>
          <div className="lp-page-content-wrapper">
            <div className="lp-page-content">
              {children}
            </div>
          </div>
        </div>
      </main>

      <footer className="lp-page-footer">
        <div className="lp-container">
          <p>© {new Date().getFullYear()} {t.pages.copyright}</p>
        </div>
      </footer>
    </div>
  )
}
