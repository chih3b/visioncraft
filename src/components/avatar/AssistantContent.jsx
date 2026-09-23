import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, Copy, Check, Terminal, Zap, Maximize2, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { API_BASE } from '../../config/api';
import { useWorkflowStore } from '../../store/workflowStore';
import './AssistantContent.css';

function isProviderWarning(text) {
  return /provider.*(?:unavailable|rate.?limit|exhausted)/i.test(text) && /⚠|⏳/.test(text);
}

function isAllProvidersFailed(text) {
  return /all providers.*unavailable/i.test(text);
}

function isCeleryWarning(text) {
  return /celery.*worker.*detected/i.test(text);
}

function isTrainingJobCreated(text) {
  return /training job.*created in database/i.test(text);
}

function isTrainingStatus(text) {
  return /training status/i.test(text) || /epoch \d/.test(text);
}

function isBashCommand(text) {
  return /^\.\/venv\/bin\//.test(text.trim()) || /^celery /.test(text.trim()) || /^npm /.test(text.trim()) || /^python /.test(text.trim());
}

function containsBashCommand(text) {
  return /\.\.\/venv\/bin\//.test(text) || /celery -A/.test(text);
}

function isDatasetSummary(text) {
  return /dataset.*(?:images|samples|classes)/i.test(text) && /(?:prepared|ready|downloaded)/i.test(text);
}

function isModelSelection(text) {
  return /(?:selected|chosen|using).*(?:model|architecture)/i.test(text) && /(?:yolo|rtdetr|sam|resnet|efficientnet)/i.test(text);
}

function parseContent(content) {
  if (!content) return [{ type: 'text', content: '' }];

  const segments = [];
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';

    if (!trimmed) {
      if (segments.length > 0 && segments[segments.length - 1].type === 'text') {
        segments[segments.length - 1].content += '\n';
      }
      i++;
      continue;
    }

    if (isProviderWarning(trimmed)) {
      segments.push({ type: 'provider-warning', content: trimmed });
      i++;
      continue;
    }

    if (isAllProvidersFailed(trimmed)) {
      segments.push({ type: 'warning-callout', content: trimmed, variant: 'error' });
      i++;
      continue;
    }

    if (isCeleryWarning(trimmed)) {
      segments.push({ type: 'celery-callout', content: trimmed });
      i++;
      if (i < lines.length && isBashCommand(lines[i].trim())) {
        segments.push({ type: 'terminal', content: lines[i].trim() });
        i++;
      }
      continue;
    }

    if (isTrainingJobCreated(trimmed)) {
      segments.push({ type: 'success-callout', content: trimmed });
      i++;
      continue;
    }

    if (isTrainingStatus(trimmed)) {
      segments.push({ type: 'progress', content: trimmed });
      i++;
      continue;
    }

    if (isBashCommand(trimmed)) {
      segments.push({ type: 'terminal', content: trimmed });
      i++;
      continue;
    }

    const multiLineBash = containsBashCommand(trimmed) && (/\bcelery\b/.test(trimmed) || /\/venv\/bin\//.test(trimmed));
    if (multiLineBash) {
      segments.push({ type: 'terminal', content: trimmed });
      i++;
      continue;
    }

    if (isDatasetSummary(trimmed)) {
      segments.push({ type: 'dataset-summary', content: trimmed });
      i++;
      continue;
    }

    if (isModelSelection(trimmed)) {
      segments.push({ type: 'model-selection', content: trimmed });
      i++;
      continue;
    }

    if (segments.length > 0 && segments[segments.length - 1].type === 'text') {
      segments[segments.length - 1].content += '\n' + trimmed;
    } else {
      segments.push({ type: 'text', content: trimmed });
    }
    i++;
  }

  return segments;
}

function TerminalSnippet({ content }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="system-terminal-snippet">
      <div className="terminal-snippet-header">
        <Terminal size={12} />
        <span>Command</span>
        <button className="terminal-copy-btn" onClick={handleCopy}>
          {copied ? <Check size={12} /> : <Copy size={12} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <div className="terminal-snippet-body">
        <code>{content}</code>
      </div>
    </div>
  );
}

function CalloutBox({ content, variant = 'warning', icon }) {
  const IconComponent = icon || (variant === 'error' ? AlertTriangle : variant === 'success' ? CheckCircle : Info);
  return (
    <div className={`system-callout callout-${variant}`}>
      <IconComponent size={16} className="callout-icon" />
      <span>{content.replace(/[*⚠️✅ℹ️]/g, '').trim()}</span>
    </div>
  );
}

function ProgressCard({ content }) {
  const epochMatch = content.match(/epoch\s*(\d+)/i);
  const currentEpoch = epochMatch ? parseInt(epochMatch[1]) : 0;
  const totalMatch = content.match(/\/\s*(\d+)/);
  const totalEpochs = totalMatch ? parseInt(totalMatch[1]) : 50;
  const pct = totalEpochs > 0 ? Math.min(100, Math.round((currentEpoch / totalEpochs) * 100)) : 0;

  return (
    <div className="system-progress-card">
      <div className="progress-card-header">
        <Zap size={14} />
        <span>Training Progress</span>
      </div>
      <div className="progress-card-body">
        <div className="progress-card-stats">
          <span>Epoch {currentEpoch} / {totalEpochs}</span>
          <span>{pct}%</span>
        </div>
        <div className="progress-card-track">
          <div className="progress-card-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

function DatasetSummaryCard({ content }) {
  const imagesMatch = content.match(/(\d[\d,]*)\s*(?:images|samples)/i);
  const classesMatch = content.match(/(\d+)\s*class/i);
  const images = imagesMatch ? imagesMatch[1] : '—';
  const classes = classesMatch ? classesMatch[1] : '—';

  const handleOpenData = () => {
    window.dispatchEvent(new CustomEvent('visioncraft-navigate', { detail: 'pipeline' }));
  };

  return (
    <div className="system-dataset-card">
      <div className="dataset-card-header">
        <Info size={14} />
        <span>Dataset Configured</span>
        <CheckCircle size={14} style={{ marginLeft: 'auto', color: '#22c55e' }} />
      </div>
      <div className="dataset-card-body">
        <div className="dataset-stat">
          <span className="dataset-stat-value">{images}</span>
          <span className="dataset-stat-label">Images</span>
        </div>
        <div className="dataset-stat">
          <span className="dataset-stat-value">{classes}</span>
          <span className="dataset-stat-label">Classes</span>
        </div>
        <button className="artifact-action-btn" onClick={handleOpenData}>
          Inspect Dataset &rarr;
        </button>
      </div>
    </div>
  );
}

// A metric that has not been reported yet is not the same as a metric of zero,
// and `||` conflated the two: a loss of 0.0 rendered as an em-dash. Returns
// null when the value is genuinely absent so the card can say so explicitly.
function pickMetric(metrics, ...keys) {
  if (!metrics) return null;
  for (const key of keys) {
    const value = metrics[key];
    if (value === null || value === undefined || value === '') continue;
    const num = typeof value === 'number' ? value : Number(value);
    if (Number.isFinite(num)) return num;
  }
  return null;
}

// The training routes send `final_metrics`; there is no `metrics` key on either
// the job list or the job detail payload. Reading `.metrics` therefore always
// found undefined, so this card's headline number was blank for every run that
// had one. The WebSocket epoch stream *does* use `metrics`, so both are
// accepted rather than swapping one hardcoded name for another.
function jobMetrics(job) {
  return job?.final_metrics || job?.metrics || null;
}

// Each head is scored on its own metric — a classifier reports top-1 accuracy
// and has no mAP at all — and the backend now says which one it used in
// `primary_metric`. Labelling every number "mAP50-95" printed a correct
// accuracy under the name of a metric that was never computed.
function headlineMetric(job) {
  const metrics = jobMetrics(job);
  if (!metrics) return { label: 'Score', value: null };
  return {
    label: metrics.primary_metric || 'mAP50-95',
    value: pickMetric(metrics, 'primary_value', 'mAP50-95', 'mAP'),
  };
}

function formatMetric(value, digits = 4) {
  if (value === null || value === undefined) return null;
  return Number(value).toFixed(digits).replace(/\.?0+$/, '') || '0';
}

function ModelSelectionCard({ content }) {
  const modelMatch = content.match(/(?:yolov?\d+[a-z]*|rtdetr-[a-z]|sam_[a-z]|resnet\d+|efficientnet[-_]?[a-z]\d*)/i);
  const modelName = modelMatch ? modelMatch[0] : 'yolov8n';
  const modelMeta = getModelMeta(modelName);
  const workflow = useWorkflowStore();

  const [jobState, setJobState] = useState(null); // { id, status, epoch, totalEpochs, map, loss }
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  // Check for existing/active training job on mount
  useEffect(() => {
    const checkExistingJob = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const savedJobId = localStorage.getItem(`vc_job_${modelName.toLowerCase()}`);
        
        const res = await fetch(`${API_BASE}/api/training/jobs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const jobs = await res.json();
          // First priority: any active running or queued job for this model
          let match = jobs.find(j => 
            (j.status === 'running' || j.status === 'queued' || j.status === 'initializing') &&
            (j.model_id && j.model_id.toLowerCase().includes(modelName.toLowerCase()))
          );
          // Second priority: exact saved job ID if available
          if (!match && savedJobId) {
            match = jobs.find(j => j.job_id === savedJobId);
          }
          
          if (match) {
            setJobState({
              id: match.job_id,
              status: match.status,
              epoch: match.current_epoch || 0,
              totalEpochs: match.epochs || 50,
              map: headlineMetric(match).value,
              metricLabel: headlineMetric(match).label,
              loss: pickMetric(jobMetrics(match), 'loss'),
            });
          }
        }
      } catch (_) {}
    };
    checkExistingJob();
  }, [modelName]);

  // Poll job status if training is active
  useEffect(() => {
    if (!jobState?.id || jobState.status === 'completed' || jobState.status === 'failed' || jobState.status === 'cancelled') return;

    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${API_BASE}/api/training/jobs/${jobState.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setJobState(prev => ({
            ...prev,
            status: data.status,
            epoch: data.current_epoch || 0,
            totalEpochs: data.epochs || 50,
            map: headlineMetric(data).value,
            metricLabel: headlineMetric(data).label,
            loss: pickMetric(jobMetrics(data), 'loss'),
          }));
        }
      } catch (_) {}
    }, 2000);

    return () => clearInterval(interval);
  }, [jobState?.id, jobState?.status]);

  const handleStartTraining = async () => {
    setIsStarting(true);
    try {
      if (!workflow.datasetPath) {
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: {
            type: 'warning',
            message: 'Prepare or select a dataset before starting training.',
          },
        }));
        window.dispatchEvent(new CustomEvent('visioncraft-navigate', { detail: 'pipeline' }));
        return;
      }
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE}/api/training/start-async`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model_id: modelName,
          epochs: 50,
          dataset_path: workflow.datasetPath,
          dataset_id: workflow.datasetId,
          class_names: workflow.detectedClasses || workflow.pipelineConfig?.target_classes || null,
          task: workflow.pipelineConfig?.task_type || null,
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || data.message || `Training request failed (${res.status})`);
      }
      localStorage.setItem(`vc_job_${modelName.toLowerCase()}`, data.job_id);
      setJobState({
        id: data.job_id,
        status: 'queued',
        epoch: 0,
        totalEpochs: 50,
        map: null,
        loss: null,
      });
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { type: 'success', message: `Training queued for ${modelName}` }
      }));
    } catch (e) {
      console.error('Failed to start training:', e);
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { type: 'error', message: e.message || 'Could not start training.' },
      }));
    } finally {
      setIsStarting(false);
    }
  };

  const handleStopTraining = async () => {
    if (!jobState?.id) return;
    setIsStopping(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE}/api/training/jobs/${jobState.id}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setJobState(prev => ({ ...prev, status: 'cancelled' }));
        window.dispatchEvent(new CustomEvent('show-toast', { 
          detail: { type: 'info', message: `Training stopped for ${modelName}` } 
        }));
      }
    } catch (e) {
      console.error('Failed to cancel training:', e);
    } finally {
      setIsStopping(false);
    }
  };

  const handleNavigate = () => {
    window.dispatchEvent(new CustomEvent('visioncraft-navigate', { detail: 'training' }));
  };

  if (jobState) {
    const total = jobState.totalEpochs || 50;
    const progress = Math.min(100, Math.round(((jobState.epoch || 0) / total) * 100));
    const isActive = jobState.status === 'running' || jobState.status === 'queued' || jobState.status === 'initializing';
    const isCompleted = jobState.status === 'completed';
    const isFailed = jobState.status === 'failed';
    const isCancelled = jobState.status === 'cancelled';
    const mapText = formatMetric(jobState.map);
    const lossText = formatMetric(jobState.loss);

    return (
      <div className={`system-model-card active-training-card state-${jobState.status}`}>
        <div className="model-card-header">
          {isActive ? <Zap size={14} className="pulse-icon" /> : <Terminal size={14} />}
          <span>
            {isActive ? 'Training Session Active' : isCompleted ? 'Training Completed' : isFailed ? 'Training Failed' : 'Training Stopped'}
          </span>
          <span className={`status-badge-mini ${jobState.status}`}>
            {isCompleted ? 'Completed' : isFailed ? 'Failed' : isCancelled ? 'Stopped' : `Epoch ${jobState.epoch}/${jobState.totalEpochs}`}
          </span>
        </div>
        <div className="model-card-live-body">
          {/* Progress is only meaningful while the job is moving. A full bar on a
              finished card is noise, and it was the loudest thing in the card. */}
          {isActive && (
            <div className="live-progress-bar-track">
              <div className="live-progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          )}
          <div className="live-metrics-grid">
            <div className="metric-box">
              <span className="metric-label">Epoch</span>
              <span className="metric-val">{jobState.epoch} / {jobState.totalEpochs}</span>
            </div>
            <div className="metric-box">
              <span className="metric-label">{jobState.metricLabel || 'Score'}</span>
              {mapText ? (
                <span className="metric-val">{mapText}</span>
              ) : (
                <span className="metric-val metric-val-absent" title="This job has not reported its headline metric yet">
                  not reported
                </span>
              )}
            </div>
            <div className="metric-box">
              <span className="metric-label">Loss</span>
              {lossText ? (
                <span className="metric-val">{lossText}</span>
              ) : (
                <span className="metric-val metric-val-absent" title="This job reported no loss value">
                  not reported
                </span>
              )}
            </div>
          </div>
          {/* A green "Completed" badge over three empty metrics reads as a
              successful run that produced nothing. Say what actually happened. */}
          {isCompleted && !mapText && !lossText && (
            <p className="model-card-note">
              The run finished but reported no metrics. That usually means validation
              did not execute — worth opening the job before trusting this model.
            </p>
          )}
          <div className="model-card-actions">
            {(isFailed || isCancelled) && (
              <button 
                className="artifact-action-btn" 
                onClick={() => { setJobState(null); handleStartTraining(); }}
              >
                Retry
              </button>
            )}
            {isActive && (
              <button 
                className="artifact-action-btn danger" 
                onClick={handleStopTraining}
                disabled={isStopping}
              >
                <Square size={8} style={{ fill: 'currentColor', marginRight: '3px' }} />
                {isStopping ? 'Stopping...' : 'Stop'}
              </button>
            )}
            <button className="artifact-action-btn primary" onClick={handleNavigate}>
              Inspect &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="system-model-card">
      <div className="model-card-header">
        <Terminal size={14} />
        <span>Model Architecture Selected</span>
        <CheckCircle size={14} style={{ marginLeft: 'auto', color: '#22c55e' }} />
      </div>
      <div className="model-card-body">
        <div className="model-card-info">
          <span className="model-card-name">{modelName}</span>
          <div className="model-card-meta">
            <span className="model-meta-badge">{modelMeta.family}</span>
            <span className="model-meta-detail">{modelMeta.params}</span>
            <span className="model-meta-detail">{modelMeta.task}</span>
          </div>
        </div>
        <button 
          className="artifact-action-btn primary" 
          onClick={handleStartTraining}
          disabled={isStarting}
        >
          {isStarting ? 'Dispatching...' : 'Start Training →'}
        </button>
      </div>
    </div>
  );
}

function getModelMeta(name) {
  const lower = name.toLowerCase();
  if (lower.includes('yolov11') || lower.includes('yolo11')) return { family: 'Ultralytics', params: '2.6M params', task: 'Detection' };
  if (lower.includes('yolov10')) return { family: 'Ultralytics', params: '2.3M params', task: 'Detection' };
  if (lower.includes('yolov8')) return { family: 'Ultralytics', params: '3.2M params', task: 'Detection' };
  if (lower.includes('yolov5')) return { family: 'Ultralytics', params: '1.9M params', task: 'Detection' };
  if (lower.includes('yolov9')) return { family: 'Ultralytics', params: '2.0M params', task: 'Detection' };
  if (lower.includes('rtdetr')) return { family: 'Transformer', params: '32M params', task: 'Detection' };
  if (lower.includes('sam')) return { family: 'Meta AI', params: '308M params', task: 'Segmentation' };
  if (lower.includes('resnet')) return { family: 'Torchvision', params: '25.6M params', task: 'Classification' };
  if (lower.includes('efficientnet')) return { family: 'Google', params: '5.3M params', task: 'Classification' };
  return { family: 'Custom', params: '—', task: 'Detection' };
}

function ProviderWarningToast({ content }) {
  return (
    <div className="system-provider-toast">
      <AlertTriangle size={14} />
      <span>{content.replace(/[*⚠️⏳]/g, '').trim()}</span>
    </div>
  );
}

function MarkdownCodeBlock({ node, inline, className, children, ...props }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  
  if (inline || !match) {
    return (
      <code {...props} className="markdown-inline-code">
        {children}
      </code>
    );
  }

  const language = match[1];
  const codeContent = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeContent);
    setCopied(true);
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { type: 'success', message: 'Code copied to clipboard' } }));
    setTimeout(() => setCopied(false), 1500);
  };

  const handleOpenPanel = () => {
    window.dispatchEvent(new CustomEvent('set-context-panel', {
      detail: {
        title: language === 'markdown' ? 'Document' : 'Code Snippet',
        content: codeContent,
        type: language
      }
    }));
  };

  return (
    <div className="markdown-code-wrapper">
      <div className="markdown-code-header">
        <span className="markdown-code-lang">{language}</span>
        <div className="markdown-code-actions">
          <button className="markdown-code-copy" onClick={handleCopy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button className="markdown-code-copy" onClick={handleOpenPanel} title="Open in Context Panel">
            <Maximize2 size={14} />
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        {...props}
        children={codeContent}
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        className="markdown-code-block"
      />
    </div>
  );
}

export default function AssistantContent({ content, showCursor }) {
  const segments = parseContent(content);

  return (
    <div className="assistant-content">
      {segments.map((seg, idx) => {
        switch (seg.type) {
          case 'provider-warning':
            return <ProviderWarningToast key={idx} content={seg.content} />;
          case 'warning-callout':
            return <CalloutBox key={idx} content={seg.content} variant="error" />;
          case 'celery-callout':
            return <CalloutBox key={idx} content={seg.content} variant="warning" icon={Terminal} />;
          case 'success-callout':
            return <CalloutBox key={idx} content={seg.content} variant="success" />;
          case 'terminal':
            return <TerminalSnippet key={idx} content={seg.content} />;
          case 'progress':
            return <ProgressCard key={idx} content={seg.content} />;
          case 'dataset-summary':
            return <DatasetSummaryCard key={idx} content={seg.content} />;
          case 'model-selection':
            return <ModelSelectionCard key={idx} content={seg.content} />;
          default:
            return (
              <div key={idx} className={`assistant-response markdown-body ${showCursor && idx === segments.length - 1 ? 'streaming' : ''}`}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: MarkdownCodeBlock,
                  }}
                >
                  {seg.content}
                </ReactMarkdown>
              </div>
            );
        }
      })}
    </div>
  );
}
