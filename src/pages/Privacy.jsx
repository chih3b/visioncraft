import PageLayout from './PageLayout'

export default function Privacy() {
  return (
    <PageLayout title="Privacy Policy">
      <p className="lp-page-date">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <p className="lp-page-intro">
        At VisionCraft, we take your privacy seriously. This policy explains how we collect, use, and protect your information.
      </p>

      <section>
        <h2>1. Information We Collect</h2>
        
        <h3>1.1 Data You Provide</h3>
        <ul>
          <li><strong>Account Information:</strong> Email address, name (when you join the waitlist)</li>
          <li><strong>API Keys:</strong> Stored locally on your device, encrypted</li>
          <li><strong>Feedback:</strong> Messages you send through contact forms or support</li>
        </ul>

        <h3>1.2 Automatically Collected Data</h3>
        <ul>
          <li><strong>Usage Data:</strong> App version, OS version, crash reports (anonymous)</li>
          <li><strong>Analytics:</strong> Feature usage patterns (no personal data)</li>
        </ul>

        <h3>1.3 What We DON'T Collect</h3>
        <ul>
          <li>Your training data, datasets, or images</li>
          <li>Your model weights or checkpoints</li>
          <li>Your AI conversations or prompts</li>
          <li>Your deployed model performance data</li>
        </ul>
      </section>

      <section>
        <h2>2. How We Use Your Information</h2>
        <ul>
          <li><strong>Product Development:</strong> Improve VisionCraft features and performance</li>
          <li><strong>Communication:</strong> Send updates about new releases and features (opt-out anytime)</li>
          <li><strong>Support:</strong> Respond to your questions and troubleshoot issues</li>
          <li><strong>Security:</strong> Detect and prevent fraud or abuse</li>
        </ul>
      </section>

      <section>
        <h2>3. Data Storage and Security</h2>
        
        <h3>3.1 Local-First Architecture</h3>
        <p>
          VisionCraft runs entirely on your machine. Your training data, models, and API keys never leave your device 
          except when you explicitly make API calls to configured providers.
        </p>

        <h3>3.2 API Key Encryption</h3>
        <p>
          API keys are encrypted using industry-standard encryption (AES-256) and stored in your system's secure keychain.
        </p>

        <h3>3.3 Third-Party Services</h3>
        <p>
          When you use VisionCraft, you make direct API calls to providers you configure (OpenAI, Groq, Roboflow, etc.). 
          These providers have their own privacy policies. We don't intercept or log these calls.
        </p>
      </section>

      <section>
        <h2>4. Data Sharing</h2>
        <p>We do NOT sell, rent, or trade your personal information. We may share data only in these cases:</p>
        <ul>
          <li><strong>With Your Consent:</strong> When you explicitly authorize it</li>
          <li><strong>Service Providers:</strong> Analytics tools (anonymized data only)</li>
          <li><strong>Legal Requirements:</strong> If required by law or to protect our rights</li>
        </ul>
      </section>

      <section>
        <h2>5. Your Rights</h2>
        <ul>
          <li><strong>Access:</strong> Request a copy of your data</li>
          <li><strong>Correction:</strong> Update incorrect information</li>
          <li><strong>Deletion:</strong> Request deletion of your account and data</li>
          <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails anytime</li>
          <li><strong>Portability:</strong> Export your data in a common format</li>
        </ul>
        <p>To exercise these rights, contact us at <a href="mailto:chihebnouri14@gmail.com">chihebnouri14@gmail.com</a></p>
      </section>

      <section>
        <h2>6. Cookies and Tracking</h2>
        <p>Our website uses minimal cookies:</p>
        <ul>
          <li><strong>Essential:</strong> Language preference, session state</li>
          <li><strong>Analytics:</strong> Anonymous usage statistics (can be disabled)</li>
        </ul>
        <p>We do not use advertising or tracking cookies.</p>
      </section>

      <section>
        <h2>7. Children's Privacy</h2>
        <p>
          VisionCraft is not directed at children under 13. We do not knowingly collect information from children. 
          If you believe a child has provided us with personal information, please contact us.
        </p>
      </section>

      <section>
        <h2>8. International Users</h2>
        <p>
          VisionCraft is developed and operated from Tunisia. By using the app, you consent to the transfer 
          of your information to Tunisia and processing under this policy.
        </p>
      </section>

      <section>
        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this policy periodically. We'll notify you of significant changes via email or in-app notification. 
          Continued use after changes constitutes acceptance.
        </p>
      </section>

      <section>
        <h2>10. Contact Us</h2>
        <p>Questions about this privacy policy? Contact us:</p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:chihebnouri14@gmail.com">chihebnouri14@gmail.com</a></li>
          <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/chiheb-nouri-8200a3193/" target="_blank" rel="noopener noreferrer">Chiheb Nouri</a></li>
        </ul>
      </section>
    </PageLayout>
  )
}
