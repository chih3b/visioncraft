import Nav from './sections/Nav'
import Hero from './sections/Hero'
import Showcase from './sections/Showcase'
import Features from './sections/Features'
import Footer from './sections/Footer'
import Chatbot from './components/Chatbot'

export default function LandingHome() {
  return (
    <>
      <span className="lp-grain" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Showcase />
        <Features />
      </main>
      <Footer />
      <Chatbot />
    </>
  )
}
