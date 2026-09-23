import { HashRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './useLanguage'
import ScrollToTop from './ScrollToTop'
import LandingHome from './LandingHome'
import Documentation from './pages/Documentation'
import Requirements from './pages/Requirements'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'

export default function LandingRouter() {
  return (
    <HashRouter>
      <LanguageProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingHome />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/requirements" element={<Requirements />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </LanguageProvider>
    </HashRouter>
  )
}
