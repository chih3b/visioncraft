import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader, CheckCircle, XCircle, Clock, Zap, AlertCircle, Play, Square } from 'lucide-react';
import './AgentMissionControl.css';

const AGENT_STATUS_ICONS = {
  running: Loader,
  completed: CheckCircle,
  failed: XCircle,
  queued: Clock,
};

const AGENT_STATUS_COLORS = {
  running: '#00e5ff',
  completed: '#22c55e',
  failed: '#ef4444',
  queued: '#888',
};

export default function AgentMissionControl({ agents = [], onCancel }) {
  const [expandedAgent, setExpandedAgent] = useState(null);

  if (agents.length === 0) return null;

  return (
    <div className="mission-control">
      <div className="mission-control-header">
        <Zap size={16} className="mission-control-icon" />
        <span className="mission-control-title">Agent Activities</span>
        <span className="mission-control-count">{agents.filter(a => a.status === 'running').length} active</span>
      </div>

      <div className="mission-control-agents">
        <AnimatePresence>
          {agents.map((agent) => {
            const StatusIcon = AGENT_STATUS_ICONS[agent.status] || AlertCircle;
            const statusColor = AGENT_STATUS_COLORS[agent.status] || '#666';
            const isExpanded = expandedAgent === agent.id;

            return (
              <motion.div
                key={agent.id}
                className={`agent-card agent-card-${agent.status}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div 
                  className="agent-card-header"
                  onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
                >
                  <StatusIcon 
                    size={16} 
                    className={`agent-status-icon ${agent.status === 'running' ? 'spin' : ''}`}
                    style={{ color: statusColor }}
                  />
                  <div className="agent-card-info">
                    <span className="agent-card-name">{agent.name}</span>
                    {agent.status === 'running' && agent.progress !== undefined && (
                      <span className="agent-card-progress">{agent.progress}%</span>
                    )}
                  </div>
                  {agent.canCancel && agent.status === 'running' && (
                    <button
                      className="agent-cancel-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCancel?.(agent.id);
                      }}
                    >
                      <Square size={12} />
                    </button>
                  )}
                </div>

                {agent.status === 'running' && agent.progress !== undefined && (
                  <div className="agent-progress-bar">
                    <motion.div
                      className="agent-progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.progress}%` }}
                      transition={{ duration: 0.3 }}
                      style={{ background: statusColor }}
                    />
                  </div>
                )}

                <AnimatePresence>
                  {isExpanded && agent.details && (
                    <motion.div
                      className="agent-card-details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="agent-details-content">
                        {agent.details.map((detail, i) => (
                          <div key={i} className="agent-detail-line">
                            <span className="agent-detail-label">{detail.label}:</span>
                            <span className="agent-detail-value">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {agent.message && (
                  <div className="agent-card-message">{agent.message}</div>
                )}

                {agent.status === 'queued' && (
                  <div className="agent-card-footer">
                    <span className="agent-queue-position">Position {agent.queuePosition || 1}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Hook for managing agent state
export function useAgentMissionControl() {
  const [agents, setAgents] = useState([]);

  const addAgent = (agent) => {
    const newAgent = {
      id: Date.now() + Math.random(),
      status: 'queued',
      progress: 0,
      canCancel: true,
      ...agent,
    };
    setAgents(prev => [...prev, newAgent]);
    return newAgent.id;
  };

  const updateAgent = (id, updates) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const removeAgent = (id) => {
    setAgents(prev => prev.filter(a => a.id !== id));
  };

  const cancelAgent = (id) => {
    updateAgent(id, { status: 'failed', message: 'Cancelled by user' });
    setTimeout(() => removeAgent(id), 2000);
  };

  return {
    agents,
    addAgent,
    updateAgent,
    removeAgent,
    cancelAgent,
  };
}
