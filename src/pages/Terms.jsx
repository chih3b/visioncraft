import PageLayout from './PageLayout'

export default function Terms() {
  return (
    <PageLayout title="Terms of Service">
      <p className="lp-page-date">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <p className="lp-page-intro">
        These Terms of Service govern your use of VisionCraft. By using the software, you agree to these terms.
      </p>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By downloading, installing, or using VisionCraft, you agree to be bound by these Terms of Service and our Privacy Policy. 
          If you don't agree, don't use the software.
        </p>
      </section>

      <section>
        <h2>2. License Grant</h2>
        
        <h3>2.1 Preview/Early Access</h3>
        <p>
          During the preview period, VisionCraft is provided free of charge. We grant you a limited, non-exclusive, 
          non-transferable license to use the software for personal or commercial purposes.
        </p>

        <h3>2.2 Restrictions</h3>
        <p>You may NOT:</p>
        <ul>
          <li>Reverse engineer, decompile, or disassemble the software</li>
          <li>Remove or modify any proprietary notices</li>
          <li>Use the software to build a competing product</li>
          <li>Resell or redistribute the software</li>
          <li>Use the software for illegal purposes</li>
        </ul>
      </section>

      <section>
        <h2>3. Your Responsibilities</h2>
        
        <h3>3.1 API Keys and Costs</h3>
        <p>
          You are responsible for obtaining and paying for your own API keys from third-party providers (OpenAI, Groq, etc.). 
          VisionCraft is not responsible for costs incurred through API usage.
        </p>

        <h3>3.2 Acceptable Use</h3>
        <p>You agree to use VisionCraft only for lawful purposes. You will NOT:</p>
        <ul>
          <li>Train models on illegal, harmful, or copyrighted content without permission</li>
          <li>Use the software to violate others' privacy or intellectual property</li>
          <li>Attempt to hack, abuse, or disrupt the software</li>
          <li>Use the software in safety-critical applications without proper validation</li>
        </ul>

        <h3>3.3 Data Responsibility</h3>
        <p>
          You own your data, models, and outputs. You are solely responsible for backing up your work and 
          ensuring compliance with applicable laws (GDPR, CCPA, etc.) when collecting or processing data.
        </p>
      </section>

      <section>
        <h2>4. Intellectual Property</h2>
        
        <h3>4.1 VisionCraft IP</h3>
        <p>
          VisionCraft, including its code, design, and documentation, is owned by Chiheb Nouri and protected by copyright 
          and other intellectual property laws.
        </p>

        <h3>4.2 Your IP</h3>
        <p>
          You retain all rights to your training data, models, and outputs. VisionCraft does not claim ownership of anything you create.
        </p>

        <h3>4.3 Feedback</h3>
        <p>
          If you provide feedback or suggestions, we may use them to improve VisionCraft without compensation or attribution.
        </p>
      </section>

      <section>
        <h2>5. Disclaimers</h2>
        
        <h3>5.1 "As Is" Software</h3>
        <p>
          VisionCraft is provided "AS IS" without warranties of any kind, express or implied. We do not guarantee:
        </p>
        <ul>
          <li>Uninterrupted or error-free operation</li>
          <li>Accuracy of AI-generated outputs or model predictions</li>
          <li>Compatibility with all hardware or software</li>
          <li>Meeting your specific requirements</li>
        </ul>

        <h3>5.2 Early Access Risks</h3>
        <p>
          VisionCraft is in early access. Expect bugs, incomplete features, and breaking changes. 
          Use at your own risk, especially in production environments.
        </p>

        <h3>5.3 Third-Party Services</h3>
        <p>
          We are not responsible for the availability, accuracy, or policies of third-party services (OpenAI, Groq, Roboflow, etc.). 
          Issues with these services are beyond our control.
        </p>
      </section>

      <section>
        <h2>6. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, VisionCraft and Chiheb Nouri SHALL NOT BE LIABLE FOR:
        </p>
        <ul>
          <li>Loss of data, models, or work product</li>
          <li>Loss of profits, revenue, or business opportunities</li>
          <li>Indirect, incidental, or consequential damages</li>
          <li>Damages exceeding $100 USD</li>
        </ul>
        <p>
          Some jurisdictions don't allow limitation of liability, so these limits may not apply to you.
        </p>
      </section>

      <section>
        <h2>7. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless VisionCraft and Chiheb Nouri from any claims, damages, or expenses 
          arising from your use of the software or violation of these terms.
        </p>
      </section>

      <section>
        <h2>8. Updates and Changes</h2>
        
        <h3>8.1 Software Updates</h3>
        <p>
          We may release updates to fix bugs, add features, or improve performance. Some updates may be automatic; 
          others may require manual installation.
        </p>

        <h3>8.2 Terms Changes</h3>
        <p>
          We may modify these terms at any time. We'll notify you of material changes via email or in-app notification. 
          Continued use after changes constitutes acceptance.
        </p>
      </section>

      <section>
        <h2>9. Termination</h2>
        <p>
          You may stop using VisionCraft at any time. We may terminate or suspend your access if you violate these terms. 
          Upon termination:
        </p>
        <ul>
          <li>Your license to use VisionCraft ends immediately</li>
          <li>You must uninstall the software</li>
          <li>You retain ownership of your data (we don't have it anyway)</li>
        </ul>
      </section>

      <section>
        <h2>10. Governing Law</h2>
        <p>
          These terms are governed by the laws of Tunisia, without regard to conflict of law principles. 
          Disputes will be resolved in Tunisian courts.
        </p>
      </section>

      <section>
        <h2>11. Severability</h2>
        <p>
          If any provision of these terms is found invalid or unenforceable, the remaining provisions continue in full effect.
        </p>
      </section>

      <section>
        <h2>12. Entire Agreement</h2>
        <p>
          These terms, together with our Privacy Policy, constitute the entire agreement between you and VisionCraft 
          regarding use of the software.
        </p>
      </section>

      <section>
        <h2>13. Contact</h2>
        <p>Questions about these terms? Contact us:</p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:chihebnouri14@gmail.com">chihebnouri14@gmail.com</a></li>
          <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/chiheb-nouri-8200a3193/" target="_blank" rel="noopener noreferrer">Chiheb Nouri</a></li>
        </ul>
      </section>
    </PageLayout>
  )
}
