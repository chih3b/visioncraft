import React from 'react';
import {
  Database, Search, Play, Images, Tags, GitCompare, RotateCcw, CheckCircle, XCircle,
  Clock, Loader, Microscope, Brain, History, Ban, Gauge, Package, Rocket, Boxes,
  Compass, FileText, FilePlus, Terminal, Workflow, Plug, Hand, Hourglass, Cpu,
} from 'lucide-react';
import { toolLabel } from './toolLabels';
import './ToolExecutionCard.css';

/**
 * One icon per tool the agent can call.
 *
 * Every name in llm_service.TOOLS belongs here. Anything missing falls through
 * to the `Play` triangle below, which read as "running a command" on steps that
 * were nothing of the kind — evaluate, export and deploy all drew the same
 * play button, so the timeline gave no clue which one you were watching.
 */
const TOOL_ICONS = {
  // Discovery
  search_hf_datasets: Search,
  search_roboflow: Search,
  search_web: Search,

  // Your own images
  list_image_uploads: Images,
  auto_label_images: Tags,

  // Data + training
  prepare_dataset: Database,
  inspect_dataset: Microscope,
  plan_training: Brain,
  start_training: Play,
  resume_training: RotateCcw,
  get_training_status: Clock,
  get_training_history: History,
  compare_training_runs: GitCompare,
  cancel_training: Ban,
  sleep_for_status: Hourglass,
  trigger_background_task: Cpu,

  // Models: evaluate, ship, deliver
  list_models: Boxes,
  evaluate_model: Gauge,
  export_model: Package,
  deploy_model: Rocket,

  // Workspace
  read_file: FileText,
  write_file: FilePlus,
  execute_command: Terminal,

  // App + session
  navigate: Compass,
  update_workflow_state: Workflow,
  call_mcp_tool: Plug,
  yield_to_user: Hand,
};

export default function ToolExecutionCard({ toolName, status, result, args }) {
  const Icon = TOOL_ICONS[toolName] || Play;
  const label = toolLabel(toolName);

  const getStatusIcon = () => {
    switch (status) {
      case 'running':
        return <Loader size={16} className="tool-status-icon status-running" />;
      case 'success':
        return <CheckCircle size={16} className="tool-status-icon status-success" />;
      case 'error':
        return <XCircle size={16} className="tool-status-icon status-error" />;
      default:
        return <Clock size={16} className="tool-status-icon status-pending" />;
    }
  };

  const formatResult = () => {
    if (!result) return null;
    
    // Parse result if it's JSON-like
    try {
      if (typeof result === 'string' && (result.startsWith('{') || result.startsWith('['))) {
        const parsed = JSON.parse(result);
        
        // Handle dataset search results
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name) {
          return (
            <div className="tool-result-datasets">
              <div className="result-count">{parsed.length} datasets found</div>
              <div className="dataset-preview-list">
                {parsed.slice(0, 3).map((ds, idx) => (
                  <div key={idx} className="dataset-preview-item">
                    <div className="dataset-name">{ds.name}</div>
                    {ds.image_count && <div className="dataset-meta">{ds.image_count} images</div>}
                  </div>
                ))}
              </div>
            </div>
          );
        }
        
        // Handle training job result
        if (parsed.job_id) {
          return (
            <div className="tool-result-training">
              <div className="training-job-id">Job ID: {parsed.job_id}</div>
              {parsed.status && <div className="training-status">Status: {parsed.status}</div>}
            </div>
          );
        }
        
        // Handle dataset preparation result
        if (parsed.dataset_path) {
          return (
            <div className="tool-result-dataset">
              <div className="dataset-path-label">Dataset ready</div>
              <div className="dataset-path">{parsed.dataset_path}</div>
            </div>
          );
        }
      }
    } catch (e) {
      // Not JSON, display as text
    }
    
    // Fallback: display first 100 chars
    const text = typeof result === 'string' ? result : JSON.stringify(result);
    return (
      <div className="tool-result-text">
        {text.substring(0, 150)}
        {text.length > 150 && '...'}
      </div>
    );
  };

  return (
    <div className={`tool-execution-card status-${status}`}>
      <div className="tool-card-header">
        <div className="tool-card-icon">
          <Icon size={18} />
        </div>
        <div className="tool-card-label">{label}</div>
        <div className="tool-card-status">
          {getStatusIcon()}
        </div>
      </div>
      
      {args && Object.keys(args).length > 0 && (
        <div className="tool-card-args">
          {Object.entries(args).map(([key, value]) => (
            <div key={key} className="tool-arg">
              <span className="arg-key">{key}:</span>
              <span className="arg-value">{String(value)}</span>
            </div>
          ))}
        </div>
      )}
      
      {status === 'success' && result && (
        <div className="tool-card-result">
          {formatResult()}
        </div>
      )}
      
      {status === 'error' && result && (
        <div className="tool-card-error">
          <div className="error-label">Error</div>
          <div className="error-message">{result}</div>
        </div>
      )}
    </div>
  );
}
