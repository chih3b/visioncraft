import React, { useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion'
import { Database, RefreshCw, Download, Cpu, FileText, TrendingUp, Zap, Lock, ScanLine, Crosshair, CheckCircle, AlertTriangle, Activity } from 'lucide-react'
import { Rise, MaskText, EASE } from '../motion/primitives'
import { WORKFLOW } from '../content'

/* ── 1. DatasetExplorer Clone ── */
function SourceUI() {
  return (
    <div className="dataset-explorer" style={{ transform: 'scale(0.85)', transformOrigin: 'top left', width: '117%', pointerEvents: 'none' }}>
      <div className="explorer-header">
        <div className="explorer-title">
          <Database size={18} />
          <span>Datasets</span>
        </div>
        <div className="explorer-header-actions">
          <button className="explorer-refresh-btn"><RefreshCw size={14} /></button>
          <button className="explorer-close">×</button>
        </div>
      </div>
      <div className="explorer-dataset-list">
        <div className="explorer-dataset-card prepared">
          <div className="dataset-card-top">
            <div className="dataset-card-name">COCO Common Objects</div>
            <span className="dataset-card-badge ready">Prepared</span>
          </div>
          <div className="dataset-card-id">coco-2017-val</div>
          <div className="dataset-card-stats">
            <span>80 classes</span>
            <span> · person, bicycle, car, motorcycle…</span>
          </div>
          <div className="dataset-card-path">📁 /data/datasets/coco-2017-val</div>
        </div>
        <div className="explorer-dataset-card">
          <div className="dataset-card-top">
            <div className="dataset-card-name">Defect Synthetic V2</div>
            <span className="dataset-card-badge synth">Synthetic</span>
          </div>
          <div className="dataset-card-id">synth-defects-04</div>
          <div className="dataset-card-stats">
            <span>4 classes</span>
            <span> · scratch, dent, crack, void</span>
          </div>
          <button className="dataset-card-prepare-btn">
            <Download size={14} /> <span>Prepare</span>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── 2. TrainingCluster Clone ── */
function TrainUI() {
  return (
    <div className="training-page interactive" style={{ transform: 'scale(0.6)', transformOrigin: 'top left', width: '166%', pointerEvents: 'none', padding: '24px', background: 'transparent' }}>
      <div className="training-header">
        <div>
          <h1 style={{ fontSize: '20px', margin: '0 0 4px', color: '#fff' }}>Training Cluster</h1>
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Train locally, generate cloud notebooks, run remotely, or execute code in-app.</p>
        </div>
      </div>
      <div className="training-body" style={{ marginTop: '24px' }}>
        <div className="training-left">
          <div className="training-mode-selector">
            <div className="mode-grid">
              <div className="mode-card active">
                <Cpu size={20} />
                <span className="mode-label">Local Machine</span>
                <span className="mode-desc">Train on your computer using GPU (CUDA/MPS) or CPU</span>
              </div>
              <div className="mode-card">
                <FileText size={20} />
                <span className="mode-label">Kaggle Notebook</span>
                <span className="mode-desc">Generate a Kaggle-compatible notebook with free GPU</span>
              </div>
            </div>
          </div>
          <div className="training-params" style={{ marginTop: '16px' }}>
            <div className="param-row">
              <label>Epochs</label>
              <input type="number" defaultValue="50" readOnly />
            </div>
            <div className="param-row">
              <label>Model</label>
              <span className="param-value">yolov8n (default)</span>
            </div>
          </div>
        </div>
        <div className="training-right">
          <div className="training-progress-panel">
            <div className="progress-header">
              <div className="progress-title">
                <Activity size={18} />
                <span>Training Progress</span>
              </div>
              <div className="progress-stats">
                <div className="stat-group"><span className="stat-label">Epoch</span><span className="stat-value">34 / 50</span></div>
                <div className="stat-group"><span className="stat-label">Status</span><span className="stat-value highlight">Running</span></div>
              </div>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: '68%' }}></div>
            </div>
          </div>
          <div className="training-charts-panel" style={{ marginTop: '16px' }}>
            <div className="charts-header">
              <TrendingUp size={18} /><span>Metrics</span>
            </div>
            <div className="charts-grid">
              <div className="chart-item">
                <div className="chart-label"><span>Loss</span><span style={{ color: '#a855f7', fontWeight: 'bold' }}>0.0241</span></div>
                <div className="chart-area">
                  <svg className="line-chart" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <path d="M 0 80 Q 100 60, 200 35 T 400 15" className="chart-line-loss" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── 3. ModelsView Clone ── */
function EvaluateUI() {
  return (
    <div className="node-canvas-page" style={{ transform: 'scale(0.7)', transformOrigin: 'top left', width: '142%', pointerEvents: 'none', padding: '24px', background: 'transparent' }}>
      <div className="canvas-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '20px', margin: '0 0 4px', color: '#fff' }}>Architecture Repository</h1>
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        <div className="graph-node architecture-node" style={{ flex: 1 }}>
          <div className="node-header"><Database size={16} /><span>Model Search Results</span></div>
          <div className="node-body">
            <div className="model-list-item selected">
              <div className="mli-name">
                <Zap size={12} className="text-safe" /> yolov8n
                <span className="badge-safe">MIT</span>
              </div>
              <div className="mli-org">Ultralytics</div>
            </div>
            <div className="model-list-item restricted">
              <div className="mli-name">
                <Lock size={12} className="text-danger" /> yolov7-tiny
                <span className="badge-danger">GPL-3.0</span>
              </div>
              <div className="mli-org">WongKinYiu</div>
            </div>
          </div>
        </div>
        <div className="graph-node compiler-node" style={{ flex: 1 }}>
          <div className="node-header"><Cpu size={16} /><span>JIT Compiler Ready</span></div>
          <div className="node-body">
            <div className="compiler-stat"><span className="c-label">Target Architecture</span><span className="c-val">yolov8n</span></div>
            <div className="compiler-stat" style={{ marginTop: '8px' }}><span className="c-label">Precision</span><span className="c-val">INT8 / FP16 / FP32</span></div>
            <button className="compile-btn" style={{ marginTop: '1rem' }}>Initialize Compilation</button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── 4. DataPipelines Clone ── */
function DeployUI() {
  return (
    <div className="vlm-processing-node" style={{ transform: 'scale(0.75)', transformOrigin: 'top left', width: '133%', pointerEvents: 'none' }}>
      <div className="vlm-header">
        <div className="vlm-title"><ScanLine size={16} /><span>Zero-Shot Auto-Labeling (VLM-Vision)</span></div>
        <div className="vlm-status"><div className="status-dot blink"></div><span>Processing 74%</span></div>
      </div>
      <div className="vlm-body">
        <div className="vlm-preview-pane">
          <div style={{ position: 'absolute', inset: 0, background: 'var(--color-carbon)' }}></div>
          <div className="vlm-scanner-line" style={{ top: '45%' }}></div>
          <div className="vlm-detection-box detection-box-primary" style={{ left: '25%', top: '30%', width: '35%', height: '28%' }}>
            <Crosshair size={14} className="crosshair-icon" />
            <div className="vlm-detection-label detection-label-primary">crack 94%</div>
          </div>
          <div className="vlm-progress-bar" style={{ width: '74%' }}></div>
        </div>
        <div className="vlm-log-pane mono-text">
          <div className="log-line">Injecting batch payload [492/650]</div>
          <div className="log-line highlight"><CheckCircle size={12} style={{marginRight: '4px'}}/> VLM Vision loaded</div>
          <div className="log-line success">Indexed frame_0490.jpg: 1 crack detected [0.92]</div>
          <div className="log-line warning"><AlertTriangle size={12} style={{marginRight: '4px'}}/> Low illumination in frame_0488</div>
        </div>
      </div>
    </div>
  )
}

/* ── 5. ProductionMonitor Clone ── */
function MonitorUI() {
  return (
    <div className="monitor-page interactive" style={{ transform: 'scale(0.65)', transformOrigin: 'top left', width: '153%', pointerEvents: 'none', padding: '24px', background: 'transparent' }}>
      <div className="monitor-header">
        <div>
          <h1 style={{ fontSize: '20px', margin: '0 0 4px', color: '#fff' }}>Production Monitor</h1>
        </div>
        <div className="monitor-status-badge"><span className="monitor-pulse-dot"></span><span>Live</span></div>
      </div>
      <div className="monitor-body" style={{ marginTop: '24px' }}>
        <div className="monitor-left" style={{ flex: 1.6 }}>
          <div className="camera-grid">
            <div className="camera-feed active">
              <div style={{ position: 'absolute', inset: 0, background: 'var(--color-carbon)' }}></div>
              <div className="camera-overlay"><span className="cam-name">warehouse-cam-north</span><span className="cam-fps">29 FPS</span></div>
              <div className="live-detection" style={{ left: '35%', top: '40%', width: '28%', height: '35%' }}><div className="detection-label">defect_crack 96%</div></div>
            </div>
            <div className="camera-feed">
              <div style={{ position: 'absolute', inset: 0, background: 'var(--color-carbon)' }}></div>
              <div className="camera-overlay"><span className="cam-name">assembly-line-a</span><span className="cam-fps">30 FPS</span></div>
            </div>
          </div>
        </div>
        <div className="monitor-right" style={{ flex: 1 }}>
          <div className="stats-panel">
            <div className="stat-box"><span className="stat-title">Throughput</span><span className="stat-val highlight">113 FPS</span></div>
            <div className="stat-box"><span className="stat-title">Avg Latency</span><span className="stat-val">8.4 ms</span></div>
          </div>
          <div className="alerts-panel" style={{ marginTop: '16px' }}>
            <div className="alerts-header"><div className="alerts-header-title"><AlertTriangle size={14} /><span>Alerts</span></div></div>
            <div className="alerts-list" style={{ marginTop: '8px' }}>
              <div className="alert-item alert-warning">
                <div className="alert-top"><span className="alert-type">Structural Risk</span><span className="alert-time">13:42</span></div>
                <div className="alert-msg">Crack propagation rate exceeded threshold (+1.2mm).</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const UI_COMPONENTS = [SourceUI, TrainUI, EvaluateUI, DeployUI, MonitorUI]

/* ============================================================================
   Workflow — scroll IS the interaction.
   ----------------------------------------------------------------------------
   Five stages, so the numbering carries real meaning. Rather than asking you to
   click tabs, the stage advances as you scroll: a sticky panel on the left
   restates the current stage while the blocks pass on the right, and a rail
   fills to show how far through the pipeline you are.

   Accessibility: the stage names stay real buttons that scroll their block into
   view, so keyboard and screen-reader users get the same navigation. Under
   reduced motion the panel simply swaps with no animation.
   ========================================================================== */
export default function Workflow() {
  const reduced = useReducedMotion()
  const stepsRef = useRef(null)
  const blockRefs = useRef([])
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ['start 0.7', 'end 0.75'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const i = Math.max(0, Math.min(WORKFLOW.length - 1, Math.floor(p * WORKFLOW.length)))
    setActive((prev) => (prev === i ? prev : i))
  })

  const railScale = useTransform(scrollYProgress, [0, 1], [0.02, 1])
  const stage = WORKFLOW[active]
  const num = (i) => String(i + 1).padStart(2, '0')

  return (
    <section className="lp-section" id="workflow">
      <div className="lp-container">
        <Rise className="lp-head-block">
          <p className="lp-eyebrow">Workflow</p>
          <MaskText
            as="h2"
            className="lp-section-title"
            text="From an empty folder to a monitored model"
          />
          <p className="lp-section-lead">
            Five stages, one continuous thread. The agent carries context from sourcing all the way
            to production — so nothing gets lost in the handoffs between tools.
          </p>
        </Rise>

        <div className="lp-flow-grid">
          {/* Sticky panel: restates whatever stage you're currently inside.
              Plain (untransformed) ancestors only, so sticky stays reliable. */}
          <div className="lp-flow-panel">
            <div className="lp-flow-panel-inner">
              <div className="lp-flow-count">
                <span className="lp-flow-count-now">{num(active)}</span>
                <span className="lp-flow-count-of">/ {num(WORKFLOW.length - 1)}</span>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={stage.step}
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  animate={reduced ? false : { opacity: 1, y: 0 }}
                  exit={reduced ? false : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.42, ease: EASE }}
                >
                  <p className="lp-flow-stage">{stage.step}</p>
                  <h3 className="lp-flow-title">{stage.title}</h3>
                  <p className="lp-flow-body">{stage.body}</p>
                  <p className="lp-flow-artifact">{stage.artifact}</p>
                </motion.div>
              </AnimatePresence>

              <nav className="lp-flow-jump" aria-label="Workflow stages">
                {WORKFLOW.map((s, i) => (
                  <button
                    key={s.step}
                    type="button"
                    className={`lp-flow-jump-btn ${i === active ? 'active' : ''}`}
                    aria-current={i === active ? 'step' : undefined}
                    onClick={() =>
                      blockRefs.current[i]?.scrollIntoView({
                        behavior: reduced ? 'auto' : 'smooth',
                        block: 'center',
                      })
                    }
                  >
                    {s.step}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* The scrolling side. Each block owns a screenful so the stage
              changes at a readable pace. */}
          <div className="lp-flow-steps" ref={stepsRef}>
            <div className="lp-flow-rail" aria-hidden="true">
              <motion.span
                className="lp-flow-rail-fill"
                style={reduced ? { transform: 'scaleY(1)' } : { scaleY: railScale }}
              />
            </div>

            <ol className="lp-flow-list">
              {WORKFLOW.map((s, i) => (
                <li
                  key={s.step}
                  ref={(el) => {
                    blockRefs.current[i] = el
                  }}
                  className={`lp-flow-block ${i === active ? 'active' : ''}`}
                >
                  <span className="lp-flow-block-index">{num(i)}</span>
                  <h4 className="lp-flow-block-name">{s.step}</h4>
                  <p className="lp-flow-block-body">{s.body}</p>
                  
                  <div className="lp-flow-block-ui">
                    {UI_COMPONENTS[i] && React.createElement(UI_COMPONENTS[i])}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
