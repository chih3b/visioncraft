import PageLayout from './PageLayout'
import { Link } from 'react-router-dom'
import { Mail, MessageSquare, ExternalLink } from 'lucide-react'

export default function Contact() {
  return (
    <PageLayout title="Contact Us">
      <p className="lp-page-intro">
        Have questions about VisionCraft? Want to discuss partnerships or enterprise solutions? 
        We'd love to hear from you.
      </p>

      <div className="lp-contact-grid">
        <div className="lp-contact-card">
          <div className="lp-contact-icon">
            <Mail size={32} />
          </div>
          <h2>Email</h2>
          <p>For general inquiries, support, or feedback</p>
          <a 
            href="mailto:chihebnouri14@gmail.com" 
            className="lp-contact-link"
          >
            chihebnouri14@gmail.com
          </a>
        </div>

        <div className="lp-contact-card">
          <div className="lp-contact-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </div>
          <h2>LinkedIn</h2>
          <p>Connect with the founder</p>
          <a 
            href="https://www.linkedin.com/in/chiheb-nouri-8200a3193/" 
            target="_blank"
            rel="noopener noreferrer"
            className="lp-contact-link"
          >
            Chiheb Nouri
          </a>
        </div>

        <div className="lp-contact-card">
          <div className="lp-contact-icon">
            <MessageSquare size={32} />
          </div>
          <h2>Live Chat</h2>
          <p>Use the chatbot on our homepage for quick questions</p>
          <Link 
            to="/" 
            className="lp-contact-link"
          >
            Chat Now
          </Link>
        </div>
      </div>

      <section className="lp-contact-section">
        <h2>What to Expect</h2>
        <ul>
          <li><strong>Response Time:</strong> We typically respond within 24-48 hours</li>
          <li><strong>Support Hours:</strong> Monday - Friday, 9 AM - 6 PM CET</li>
          <li><strong>Bug Reports:</strong> Please include your OS version, VisionCraft version, and steps to reproduce</li>
        </ul>
      </section>

      <section className="lp-contact-section">
        <h2>Before You Reach Out</h2>
        <p>Check if your question is answered in our resources:</p>
        <ul>
          <li><Link to="/docs">Documentation</Link> - Installation, setup, and usage guides</li>
          <li><Link to="/requirements">System Requirements</Link> - Hardware and software needs</li>
          <li><Link to="/">FAQ</Link> - Common questions and answers</li>
        </ul>
      </section>

      <section className="lp-contact-section lp-contact-enterprise">
        <h2>Enterprise & Partnerships</h2>
        <p>
          Interested in VisionCraft for your team or organization? 
          Contact us to discuss:
        </p>
        <ul>
          <li>Team licensing and deployment</li>
          <li>Custom integrations and features</li>
          <li>Training and onboarding</li>
          <li>Strategic partnerships</li>
        </ul>
        <a 
          href="mailto:chihebnouri14@gmail.com?subject=Enterprise%20Inquiry" 
          className="lp-btn lp-btn-primary"
          style={{ marginTop: '16px' }}
        >
          Get in Touch
        </a>
      </section>
    </PageLayout>
  )
}
