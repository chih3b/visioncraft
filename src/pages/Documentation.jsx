import PageLayout from './PageLayout'
import { Book, Zap, Code, Rocket } from 'lucide-react'

export default function Documentation() {
  return (
    <PageLayout title="Documentation">
      <div className="lp-docs-grid">
        <aside className="lp-docs-sidebar">
          <nav>
            <h3>Getting Started</h3>
            <ul>
              <li><a href="#installation">Installation</a></li>
              <li><a href="#quick-start">Quick Start</a></li>
              <li><a href="#api-keys">API Keys Setup</a></li>
            </ul>

            <h3>Core Features</h3>
            <ul>
              <li><a href="#agent-modes">Agent Modes</a></li>
              <li><a href="#datasets">Dataset Sourcing</a></li>
              <li><a href="#training">Model Training</a></li>
              <li><a href="#deployment">Deployment</a></li>
            </ul>

            <h3>Advanced</h3>
            <ul>
              <li><a href="#monitoring">Production Monitoring</a></li>
              <li><a href="#marketplace">Model Marketplace</a></li>
            </ul>
          </nav>
        </aside>

        <article className="lp-docs-content">
          <section id="installation">
            <h2><Book size={24} /> Installation</h2>
            <p>VisionCraft is available for macOS (early access). Windows and Linux versions are coming soon.</p>
            
            <h3>System Requirements</h3>
            <ul>
              <li><strong>macOS:</strong> 12.0 (Monterey) or later</li>
              <li><strong>RAM:</strong> 8GB minimum, 16GB recommended</li>
              <li><strong>Storage:</strong> 2GB free space</li>
              <li><strong>GPU:</strong> Optional but recommended for training</li>
            </ul>

            <div className="lp-code-block">
              <code>
                # Download from our website<br/>
                # Or use Homebrew (coming soon)<br/>
                brew install --cask visioncraft
              </code>
            </div>
          </section>

          <section id="quick-start">
            <h2><Zap size={24} /> Quick Start</h2>
            <p>Get up and running with VisionCraft in minutes.</p>

            <ol className="lp-steps-list">
              <li>
                <strong>Launch VisionCraft</strong>
                <p>Open the app and complete the welcome flow</p>
              </li>
              <li>
                <strong>Add Your API Keys</strong>
                <p>Go to Settings → API Keys and add your provider keys (OpenAI, Groq, Roboflow, etc.)</p>
              </li>
              <li>
                <strong>Start Your First Project</strong>
                <p>Click "New Project" and choose your computer vision task</p>
              </li>
              <li>
                <strong>Talk to the Agent</strong>
                <p>Describe what you want to build, and let the agent guide you through the pipeline</p>
              </li>
            </ol>
          </section>

          <section id="api-keys">
            <h2><Code size={24} /> API Keys Setup</h2>
            <p>VisionCraft uses your own API keys for AI providers and data sources.</p>

            <h3>Required Keys</h3>
            <ul>
              <li><strong>Groq</strong> (free tier available) - Powers the AI agent</li>
              <li><strong>Roboflow</strong> (optional) - Dataset sourcing</li>
            </ul>

            <h3>Optional Keys</h3>
            <ul>
              <li><strong>OpenAI</strong> - Alternative LLM provider</li>
              <li><strong>Google Gemini</strong> - Alternative LLM provider</li>
              <li><strong>Kaggle</strong> - Dataset sourcing</li>
              <li><strong>Hugging Face</strong> - Model marketplace</li>
            </ul>

            <div className="lp-note">
              <strong>Privacy Note:</strong> Your API keys are stored locally and encrypted. They never leave your machine except to make authorized API calls to the providers you configure.
            </div>
          </section>

          <section id="agent-modes">
            <h2><Rocket size={24} /> Agent Modes</h2>
            <p>VisionCraft's agent operates in three modes, giving you full control over autonomy.</p>

            <div className="lp-mode-cards">
              <div className="lp-mode-card">
                <h3>Plan Mode</h3>
                <p>The agent outlines the steps it would take but waits for your approval before executing. Perfect for learning and understanding the process.</p>
              </div>

              <div className="lp-mode-card">
                <h3>Execute Mode</h3>
                <p>The agent autonomously performs tasks end-to-end. It still explains what it's doing at each step, but doesn't wait for confirmation.</p>
              </div>

              <div className="lp-mode-card">
                <h3>Review Mode</h3>
                <p>After execution, the agent audits its own work and reports what it verified and what it couldn't confirm. Great for validation.</p>
              </div>
            </div>
          </section>

          <section id="datasets">
            <h2>Dataset Sourcing</h2>
            <p>Search and download datasets directly within VisionCraft from:</p>
            <ul>
              <li>Roboflow Universe - 100,000+ computer vision datasets</li>
              <li>Kaggle - Public datasets and competitions</li>
              <li>Hugging Face - ML datasets and models</li>
            </ul>
            <p>The agent automatically inspects class balance and data quality before you commit to training.</p>
          </section>

          <section id="training">
            <h2>Model Training</h2>
            <p>Train models locally or on cloud GPUs with live metric streaming:</p>
            <ul>
              <li>Real-time loss and mAP visualization</li>
              <li>Automatic checkpoint versioning</li>
              <li>Experiment comparison</li>
              <li>Rollback to best epoch</li>
            </ul>
          </section>

          <section id="deployment">
            <h2>Edge Deployment</h2>
            <p>Export models and deploy to registered devices:</p>
            <ul>
              <li>Export formats: ONNX, Core ML, TensorRT</li>
              <li>Device fleet management</li>
              <li>Remote deployment verification</li>
            </ul>
          </section>

          <section id="monitoring">
            <h2>Production Monitoring</h2>
            <p>Monitor your deployed models in real-time:</p>
            <ul>
              <li>Throughput and latency tracking</li>
              <li>Confidence drift detection</li>
              <li>Per-device performance metrics</li>
              <li>Agent-suggested fixes when metrics degrade</li>
            </ul>
          </section>
        </article>
      </div>
    </PageLayout>
  )
}
