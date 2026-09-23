import PageLayout from './PageLayout'
import { Link } from 'react-router-dom'
import { Monitor, Cpu, HardDrive, Zap } from 'lucide-react'

export default function Requirements() {
  return (
    <PageLayout title="System Requirements">
      <p className="lp-page-intro">
        VisionCraft is designed to run efficiently on modern hardware. Here's what you need to get started.
      </p>

      <div className="lp-req-grid">
        <div className="lp-req-card">
          <div className="lp-req-icon">
            <Monitor size={32} />
          </div>
          <h2>Operating System</h2>
          
          <h3>macOS (Available Now)</h3>
          <ul>
            <li><strong>Minimum:</strong> macOS 12 (Monterey)</li>
            <li><strong>Recommended:</strong> macOS 13 (Ventura) or later</li>
            <li><strong>Architecture:</strong> Apple Silicon (M1/M2/M3) or Intel</li>
          </ul>

          <h3>Windows & Linux (Coming Soon)</h3>
          <p>Join the waitlist to be notified when Windows and Linux builds are available.</p>
        </div>

        <div className="lp-req-card">
          <div className="lp-req-icon">
            <Cpu size={32} />
          </div>
          <h2>Processor & Memory</h2>
          
          <h3>CPU</h3>
          <ul>
            <li><strong>Minimum:</strong> Dual-core processor, 2.0 GHz</li>
            <li><strong>Recommended:</strong> Quad-core or better, 2.5 GHz+</li>
            <li><strong>Apple Silicon:</strong> M1 or newer (excellent performance)</li>
          </ul>

          <h3>RAM</h3>
          <ul>
            <li><strong>Minimum:</strong> 8GB</li>
            <li><strong>Recommended:</strong> 16GB</li>
            <li><strong>For large models:</strong> 32GB+</li>
          </ul>
        </div>

        <div className="lp-req-card">
          <div className="lp-req-icon">
            <HardDrive size={32} />
          </div>
          <h2>Storage</h2>
          
          <ul>
            <li><strong>Application:</strong> ~500MB</li>
            <li><strong>Working space:</strong> 2GB minimum free</li>
            <li><strong>Datasets:</strong> Varies (typically 500MB - 5GB)</li>
            <li><strong>Model checkpoints:</strong> 100MB - 1GB per model</li>
          </ul>

          <p className="lp-req-note">
            <strong>Recommended:</strong> SSD for best performance during training and inference
          </p>
        </div>

        <div className="lp-req-card">
          <div className="lp-req-icon">
            <Zap size={32} />
          </div>
          <h2>GPU (Optional)</h2>
          
          <p>A GPU significantly accelerates model training but is not required.</p>

          <h3>Supported GPUs</h3>
          <ul>
            <li><strong>NVIDIA:</strong> GTX 1060 or newer (6GB+ VRAM recommended)</li>
            <li><strong>AMD:</strong> Radeon RX 5000 series or newer</li>
            <li><strong>Apple Silicon:</strong> Built-in GPU (M1/M2/M3) works great</li>
          </ul>

          <h3>Cloud GPU Fallback</h3>
          <p>No GPU? You can use cloud GPUs through your own provider (AWS, GCP, RunPod, etc.) for intensive training jobs.</p>
        </div>
      </div>

      <section className="lp-req-section">
        <h2>Network Requirements</h2>
        <ul>
          <li><strong>Internet connection:</strong> Required for API calls and dataset downloads</li>
          <li><strong>Bandwidth:</strong> 10 Mbps+ recommended for smooth dataset downloads</li>
          <li><strong>Firewall:</strong> Allow outbound HTTPS (443) for API providers</li>
        </ul>
      </section>

      <section className="lp-req-section">
        <h2>API Provider Accounts</h2>
        <p>VisionCraft uses your own API keys. You'll need accounts with:</p>
        
        <h3>Required (Free Tier Available)</h3>
        <ul>
          <li><strong>Groq:</strong> Powers the AI agent (free tier: 14,400 requests/day)</li>
        </ul>

        <h3>Optional</h3>
        <ul>
          <li><strong>OpenAI:</strong> Alternative LLM provider</li>
          <li><strong>Google Gemini:</strong> Alternative LLM provider</li>
          <li><strong>Roboflow:</strong> Dataset sourcing</li>
          <li><strong>Kaggle:</strong> Dataset competitions</li>
          <li><strong>Hugging Face:</strong> Model marketplace</li>
        </ul>
      </section>

      <section className="lp-req-section lp-req-highlight">
        <h2>Recommended Setup</h2>
        <p>For the best VisionCraft experience:</p>
        <ul className="lp-req-checklist">
          <li>✅ macOS 13+ on Apple Silicon (M1 or newer)</li>
          <li>✅ 16GB RAM</li>
          <li>✅ 256GB+ SSD with 50GB+ free</li>
          <li>✅ Stable internet (25+ Mbps)</li>
          <li>✅ Groq API key (free)</li>
          <li>✅ Optional: NVIDIA GPU with 8GB+ VRAM for local training</li>
        </ul>
      </section>

      <section className="lp-req-section">
        <h2>Still Have Questions?</h2>
        <p>
          Check our <Link to="/docs">documentation</Link> or reach out via the <Link to="/contact">contact page</Link>.
        </p>
      </section>
    </PageLayout>
  )
}
