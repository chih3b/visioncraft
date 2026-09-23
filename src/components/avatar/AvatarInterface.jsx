import { useState, useEffect, useMemo, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Check, CheckCircle, ChevronRight, Zap, Lock, ShieldAlert, Cpu, TrendingUp, ArrowRight, ChevronDown, Square, Copy, RefreshCw, Edit2, RotateCcw, Crosshair, FileText, WifiOff, Database, Rocket, ScanSearch, BookOpen, PackageOpen, Sparkles } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import { API_BASE, WS_BASE } from '../../config/api';
import { isMockupMode, MOCKUP_DATA } from '../../utils/mockupMode';
import AssistantContent from './AssistantContent';
import AgentMissionControl, { useAgentMissionControl } from './AgentMissionControl';
import { toolLabel } from './toolLabels';
import './AvatarInterface.css';
import './AvatarMarkdown.css';

// Persist session ID across page refreshes
let _lastSessionId = localStorage.getItem('_lastSessionId') || null;

const MODE_PRESENTATION = {
  plan: {
    eyebrow: 'Architecture mode',
    title: 'Design the right vision system before running it.',
    subtitle: 'Compare datasets, model families, compute targets, and deployment constraints without changing project state.',
    placeholder: 'Describe the system you want to plan…',
  },
  execute: {
    eyebrow: 'Execution workspace',
    title: 'Turn visual data into a working model.',
    subtitle: 'Search data, prepare a pipeline, train a model, and carry the result through deployment.',
    placeholder: 'Describe the vision workflow to run…',
  },
  review: {
    eyebrow: 'Review mode',
    title: 'Inspect results, risks, and next decisions.',
    subtitle: 'Review datasets, runs, model quality, deployment readiness, or an existing implementation.',
    placeholder: 'What should VisionCraft review?…',
  },
};

const STARTER_TASKS = [
  {
    title: 'Explore a dataset',
    description: 'Find and compare real image datasets for a task.',
    prompt: 'Find suitable datasets for my computer vision project and compare their classes, size, and license.',
    icon: Database,
  },
  {
    title: 'Train an object detector',
    description: 'Prepare data, choose a model, and launch a run.',
    prompt: 'Help me prepare a dataset and train an object detection model for production use.',
    icon: Crosshair,
  },
  {
    title: 'Analyze visual input',
    description: 'Attach an image or document and inspect its contents.',
    prompt: 'Analyze the image I attach and recommend the right computer vision approach.',
    icon: ScanSearch,
  },
  {
    title: 'Plan an edge deployment',
    description: 'Match a trained model to target hardware and runtime.',
    prompt: 'Plan how to deploy my trained model to an edge device and validate runtime compatibility.',
    icon: Rocket,
  },
];

function AvatarInterface({
  activeSessionId: propSessionId,
  activeProjectId: propProjectId,
  activeProjectTitle,
  agentMode,
  setAgentMode,
  onWorkspaceStateChange,
}) {
  const workflow = useWorkflowStore();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    // If mockup mode is enabled, start with mockup messages
    if (isMockupMode()) {
      console.log('[AvatarInterface] Initializing with mockup messages');
      return MOCKUP_DATA.agentConversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content || '',
        timestamp: msg.timestamp,
        status: msg.status,
        action: msg.action,
        details: msg.details,
        tools: msg.tools || [] // Include tools array if present
      }))
    }
    return []
  });
  const [copiedIdx, setCopiedIdx] = useState(null);
  const editIndexRef = useRef(null); // index to truncate from when user sends a modified message
  const [isTyping, setIsTyping] = useState(false);
  const [isAutoPilot, setIsAutoPilot] = useState(false);
  const isAutoPilotRef = useRef(false);
  const [wsReady, setWsReady] = useState(false);
  
  const [activeSessionId, setActiveSessionId] = useState(propSessionId || _lastSessionId);
  const projectIdRef = useRef(propProjectId);
  const [provider, setProvider] = useState('groq');
  const [showProviderPicker, setShowProviderPicker] = useState(false);
  const [availableProviders, setAvailableProviders] = useState({
    gemini: false,
    groq: false,
    openai: false,
  });

  useEffect(() => { isAutoPilotRef.current = isAutoPilot; }, [isAutoPilot]);

  useEffect(() => {
    projectIdRef.current = propProjectId;
  }, [propProjectId]);

  useEffect(() => {
    if (propSessionId !== undefined && propSessionId !== activeSessionId) {
      queueMicrotask(() => setActiveSessionId(propSessionId));
    }
  }, [activeSessionId, propSessionId]);
  
  // Fetch available providers from user settings
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${API_BASE}/api/settings/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const settings = await res.json();
          setAvailableProviders({
            gemini: !!settings.gemini_api_key,
            groq: !!settings.groq_api_key,
            openai: !!settings.openai_api_key,
          });
          
          // Auto-select first available provider
          if (settings.groq_api_key) setProvider('groq');
          else if (settings.gemini_api_key) setProvider('gemini');
          else if (settings.openai_api_key) setProvider('openai');
        }
      } catch (err) {
        console.error('Failed to fetch provider availability:', err);
      }
    };
    fetchProviders();
  }, []);

  const PROVIDERS = [
    { key: 'gemini', label: 'Gemini', online: availableProviders.gemini },
    { key: 'groq', label: 'Groq', online: availableProviders.groq },
    { key: 'openai', label: 'OpenAI', online: availableProviders.openai },
  ];
  const configuredProviders = PROVIDERS.filter((item) => item.online);
  const hasConfiguredProvider = configuredProviders.some((item) => item.key === provider);
  const providerLabel = PROVIDERS.find((item) => item.key === provider)?.label || provider;

  const [modelCards, setModelCards] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showContinue, setShowContinue] = useState(false);
  const [agentThinking, setAgentThinking] = useState(false);
  // Structured tool events for the in-flight turn. The ref is the source of
  // truth (read synchronously by the 'done' handler); state mirrors it to render.
  const liveToolsRef = useRef([]);
  const [liveTools, setLiveTools] = useState([]);
  const { agents, cancelAgent } = useAgentMissionControl();
  
  // File attachment state
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    console.log('[State] modelCards updated:', modelCards.length, 'cards');
    if (modelCards.length > 0) {
      console.log('[State] First card:', modelCards[0]);
    }
  }, [modelCards]);

  const ws = useRef(null);
  const scrollAreaRef = useRef(null);
  const reconnectDelayRef = useRef(1000);
  const reconnectTimerRef = useRef(null);
  const MAX_RECONNECT_DELAY = 30000;
  const AUTH_REJECTED_CODE = 1008;
  const [connectionError, setConnectionError] = useState(null);
  
  const tokenQueue = useRef('');

  useEffect(() => {
    const handleLoadSession = (e) => {
      const sessionId = e.detail;
      console.log('[AvatarInterface] load-session event received:', sessionId);
      setActiveSessionId(sessionId);
      loadSessionMessages(sessionId);
      reconnectWs(sessionId);
      resetState();
    };

    const handleNewSession = () => {
      console.log('[AvatarInterface] new-session event received');
      setActiveSessionId(null);
      // Don't clear messages in mockup mode
      if (!isMockupMode()) {
        setMessages([]);
      }
      reconnectWs(null);
      resetState();
    };

    console.log('[AvatarInterface] Setting up event listeners');
    window.addEventListener('load-session', handleLoadSession);
    window.addEventListener('new-session', handleNewSession);

    return () => {
      console.log('[AvatarInterface] Removing event listeners');
      window.removeEventListener('load-session', handleLoadSession);
      window.removeEventListener('new-session', handleNewSession);
    };
  }, []);

  function resetState() {
    tokenQueue.current = '';
    liveToolsRef.current = [];
    setLiveTools([]);
    setModelCards([]);
    setSelectedModel(null);
    setShowContinue(false);
  }

  async function loadSessionMessages(sessionId) {
    // Skip loading session messages if mockup mode is enabled
    if (isMockupMode()) {
      console.log('[AvatarInterface] Mockup mode enabled - skipping session message load');
      return;
    }
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE}/api/history/sessions/${sessionId}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to fetch messages for session', err);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (tokenQueue.current.length > 0) {
        const partialNavMatch = tokenQueue.current.match(/\[[a-zA-Z0-9_:]*$/);
        const drainEnd = partialNavMatch ? partialNavMatch.index : tokenQueue.current.length;
        if (drainEnd === 0) return;

        const chunkSize = Math.min(
          Math.max(1, Math.floor(drainEnd / 15)),
          drainEnd
        );
        const chunk = tokenQueue.current.substring(0, chunkSize);
        tokenQueue.current = tokenQueue.current.substring(chunkSize);

        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg && lastMsg.role === 'assistant') {
            newMessages[newMessages.length - 1] = {
              ...lastMsg,
              content: lastMsg.content + chunk
            };
          }
          return newMessages;
        });
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Fold a tool_event into the live timeline. 'start' appends (or re-opens) an
  // entry; 'done'/'error' resolves the most recent unresolved entry of that name.
  const applyToolEvent = (ev) => {
    const next = [...liveToolsRef.current];
    if (ev.status === 'start') {
      next.push({ name: ev.name, status: 'running', task: ev.task || null });
    } else {
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i].name === ev.name && next[i].status === 'running') {
          next[i] = {
            ...next[i],
            status: ev.status === 'error' ? 'error' : 'success',
            // A dataset search closes with structured, selectable options so the
            // user can click a result instead of retyping its name.
            ...(Array.isArray(ev.choices) && ev.choices.length > 0
              ? { choices: ev.choices }
              : {}),
          };
          break;
        }
      }
    }
    liveToolsRef.current = next;
    setLiveTools(next);
    // Tools usually run before any prose arrives, so make sure there is an
    // assistant bubble to host the timeline.
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.role === 'assistant') return prev;
      return [...prev, { role: 'assistant', content: '' }];
    });
  };

  // A dropped socket ends the turn, so nothing can still be running. Mark any
  // in-flight tool as failed rather than leaving a spinner going forever.
  const settleRunningTools = () => {
    if (!liveToolsRef.current.some(t => t.status === 'running')) return;
    const settled = liveToolsRef.current.map(t =>
      t.status === 'running' ? { ...t, status: 'error' } : t
    );
    liveToolsRef.current = settled;
    setLiveTools(settled);
  };

  function reconnectWs(sessionId) {
    if (ws.current) {
      ws.current.onclose = null;
      ws.current.close();
      setWsReady(false);
    }
    setTimeout(() => connect(sessionId), 100);
  }

  function connect(sessionIdToUse) {
    const socket = new WebSocket(`${WS_BASE}/ws/chat`);
    ws.current = socket;

    socket.onopen = () => {
      if (ws.current !== socket) {
        socket.close();
        return;
      }

      // Reset reconnect delay and any connection error banner on success.
      reconnectDelayRef.current = 1000;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      // Always clear the banner on a successful socket open. `connect` is
      // invoked from a timer, so checking the value captured when that timer
      // was created can leave a stale "Connection lost" warning visible even
      // while the shell correctly reports Connected.
      setConnectionError(null);

      const token = localStorage.getItem('access_token');
      if (token) {
        const payload = { token };
        if (sessionIdToUse) {
          payload.session_id = sessionIdToUse;
        }
        if (projectIdRef.current) {
          payload.project_id = projectIdRef.current;
        }
        socket.send(JSON.stringify(payload));
      }
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[WS] Received message type:', data.type, data);
        
        if (data.type === 'status' && data.status === 'connected') {
          setWsReady(true);
          window.dispatchEvent(new CustomEvent('ws-status', { detail: { connected: true } }));
          const sid = sessionIdToUse || data.session_id;
          if (data.session_id && !sessionIdToUse) {
            setActiveSessionId(data.session_id);
            _lastSessionId = data.session_id;
            localStorage.setItem('_lastSessionId', data.session_id);
            window.dispatchEvent(new CustomEvent('refresh-sessions'));
          }
          if (sid) {
            loadSessionMessages(sid);
          }
          return;
        }

        if (data.type === 'model_cards' && data.models) {
          console.log('[WS] Received model_cards:', data.models.length, 'models');
          console.log('[WS] First model:', data.models[0]);
          setModelCards(data.models);
          setShowContinue(false);
          setSelectedModel(null);
          return;
        }

        if (data.type === 'suggestions' && data.suggestions) {
          console.log('[WS] Received suggestions:', data.suggestions.length, 'suggestions');
          // Show high-priority suggestions as toasts
          data.suggestions.forEach((suggestion) => {
            if (suggestion.priority === 'high') {
              window.dispatchEvent(new CustomEvent('show-toast', {
                detail: {
                  type: 'info',
                  message: suggestion.message.replace(/💡|⚠️|✨/g, '').trim()
                }
              }));
            }
          });
          return;
        }

        // Training started notification
        if (data.type === 'training_started') {
          console.log('[WS] Training started:', data);
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: {
              type: 'success',
              message: `Training started: ${data.model_id || 'model'} for ${data.epochs || '?'} epochs`
            }
          }));
          // Navigate to training tab automatically
          if (data.navigate_to_training) {
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('visioncraft-navigate', { detail: 'training' }));
            }, 1000);
          }
          return;
        }

        // Structured tool lifecycle from the agent loop (start → done|error).
        if (data.type === 'tool_event' && data.event?.name) {
          applyToolEvent(data.event);
          return;
        }

        // Out-of-band notices (provider failover, rate limits). These are
        // infrastructure, not something the assistant said, so they render as
        // chrome and never enter the message history.
        if (data.type === 'notice' && data.event?.message) {
          const { level, message } = data.event;
          if (level === 'error') {
            setConnectionError(message);
          } else {
            // rate_limit and warning are both "degraded but still working" —
            // amber. Anything else is purely informational.
            const isDegraded = level === 'rate_limit' || level === 'warning';
            window.dispatchEvent(new CustomEvent('show-toast', {
              detail: { type: isDegraded ? 'warning' : 'info', message },
            }));
          }
          return;
        }

        if (data.type === 'token' && data.content) {
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMsg = newMessages[newMessages.length - 1];
            if (!lastMsg || lastMsg.role !== 'assistant') {
              newMessages.push({ role: 'assistant', content: '' });
              return newMessages;
            }
            return prev;
          });

          // Detect agent planning/thinking
          if (data.content.includes('PLAN:') || data.content.includes('Step ') || data.content.includes('1.')) {
            setAgentThinking(true);
            setTimeout(() => setAgentThinking(false), 3000);
          }

          // Detect training started
          if (data.content.includes('[TRAINING_STARTED:')) {
            const jobIdMatch = data.content.match(/\[TRAINING_STARTED:([^\]]+)\]/);
            const jobId = jobIdMatch ? jobIdMatch[1] : null;
            
            console.log('[AvatarInterface] Training started detected:', jobId);
            
            window.dispatchEvent(new CustomEvent('show-toast', {
              detail: {
                type: 'success',
                message: '🚀 Training started! Switching to Training tab...'
              }
            }));
            
            // Navigate to training tab after 1 second
            setTimeout(() => {
              console.log('[AvatarInterface] Navigating to training tab');
              window.dispatchEvent(new CustomEvent('visioncraft-navigate', { detail: 'training' }));
            }, 1000);
          }

          tokenQueue.current += data.content.replace(/\[NAV:[a-z_]+\]/g, '').replace(/\[TRAINING_STARTED:[^\]]+\]/g, '');

          const navRegex = /\[TOOL_NAV:([a-z_]+)\]/g;
          const navMatches = [...tokenQueue.current.matchAll(navRegex)];
          if (navMatches.length > 0) {
            tokenQueue.current = tokenQueue.current.replace(/\[TOOL_NAV:([a-z_]+)\]/g, (match, page) => {
              const label = page.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('visioncraft-navigate', { detail: page }));
                window.dispatchEvent(new CustomEvent('workflow-navigate', { detail: page }));
              }, 250);
              return `\n\n→ Opening **${label}**…\n`;
            });
          }

        } else if (data.type === 'done') {
          const diffStats = data.diff || null;
          const drainInterval = setInterval(() => {
            if (tokenQueue.current.length === 0) {
              setIsTyping(false);
              // Stamp the diff stats + this turn's tool timeline onto the last
              // assistant message, then reset the live timeline for the next turn.
              // The turn is over, so nothing can still be running. If a close
              // event was dropped, settle the entry instead of persisting a
              // spinner that would never resolve.
              const turnTools = liveToolsRef.current.map(t =>
                t.status === 'running' ? { ...t, status: 'success' } : t
              );
              if (diffStats || turnTools.length > 0) {
                setMessages(prev => {
                  const updated = [...prev];
                  for (let i = updated.length - 1; i >= 0; i--) {
                    if (updated[i].role === 'assistant') {
                      updated[i] = {
                        ...updated[i],
                        ...(diffStats ? { diff: diffStats } : {}),
                        ...(turnTools.length > 0 ? { tools: turnTools } : {}),
                      };
                      break;
                    }
                  }
                  return updated;
                });
              }
              liveToolsRef.current = [];
              setLiveTools([]);
              window.dispatchEvent(new CustomEvent('refresh-sessions'));
              clearInterval(drainInterval);
            }
          }, 50);
        }
      } catch (err) {
        console.error('[WS] Parse error:', err);
      }
    };

    socket.onclose = (e) => {
      if (ws.current !== socket) return;
      setWsReady(false);
      setIsTyping(false);
      settleRunningTools();
      window.dispatchEvent(new CustomEvent('ws-status', { detail: { connected: false } }));

      // 1008 = auth rejected. Retrying is futile and would hammer the server,
      // so surface it and make the user re-authenticate instead.
      if (e.code === AUTH_REJECTED_CODE) {
        console.warn('[WS] Authentication rejected — not reconnecting.');
        setConnectionError('Session expired. Please sign in again.');
        window.dispatchEvent(new CustomEvent('auth-expired'));
        return;
      }

      // Exponential backoff with jitter, so many clients don't retry in lockstep.
      const delay = reconnectDelayRef.current;
      const jittered = Math.round(delay * (0.8 + Math.random() * 0.4));
      console.log(`[WS] Connection closed (${e.code}). Reconnecting in ${jittered}ms...`);
      setConnectionError(`Connection lost. Reconnecting in ${Math.ceil(jittered / 1000)}s...`);

      reconnectTimerRef.current = setTimeout(() => {
        connect(sessionIdToUse);
        reconnectDelayRef.current = Math.min(delay * 1.5, MAX_RECONNECT_DELAY);
      }, jittered);
    };

    socket.onerror = () => {
      if (ws.current !== socket) return;
      socket.close();
    };
  }

  useEffect(() => {
    connect(activeSessionId);

    return () => {
      // Cancel a pending reconnect so it can't revive the socket after unmount.
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      if (ws.current) {
        ws.current.onclose = null;
        if (ws.current.readyState !== WebSocket.CONNECTING) {
          ws.current.close();
        }
      }
    };
  }, []);

  const scrollToBottom = () => {
    const el = scrollAreaRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, modelCards]);

  const handleSend = async () => {
    if ((!input.trim() && attachedFiles.length === 0) || !ws.current || !wsReady) return;
    
    const msg = input.trim();
    
    // Create message content with file references
    let messageContent = msg;
    if (attachedFiles.length > 0) {
      const fileNames = attachedFiles.map(f => f.name).join(', ');
      messageContent = msg ? `${msg}\n\n[Attached files: ${fileNames}]` : `[Attached files: ${fileNames}]`;
    }
    
    // If the user is sending an edited message, truncate history from that point first
    if (editIndexRef.current !== null) {
      setMessages(prev => [...prev.slice(0, editIndexRef.current), { 
        role: 'user', 
        content: messageContent,
        files: attachedFiles.map(f => ({ name: f.name, type: f.type, size: f.size }))
      }]);
      editIndexRef.current = null;
    } else {
      setMessages(prev => [...prev, { 
        role: 'user', 
        content: messageContent,
        files: attachedFiles.map(f => ({ name: f.name, type: f.type, size: f.size }))
      }]);
    }
    
    // If we have file attachments, we need to send them differently
    if (attachedFiles.length > 0) {
      try {
        const formData = new FormData();
        formData.append('message', msg);
        formData.append('autopilot', isAutoPilot);
        formData.append('provider', provider);
        formData.append('agent_mode', agentMode);
        formData.append('session_id', activeSessionId || '');
        formData.append('project_id', projectIdRef.current || '');
        
        attachedFiles.forEach((file) => {
          formData.append('files', file);
        });
        
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_BASE}/api/agent/message-with-files`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to send message with files');
        }

        const result = await response.json();
        if (result.status !== 'success' || !result.enhanced_message) {
          throw new Error(result.message || 'Failed to process attached files');
        }

        ws.current.send(JSON.stringify({
          message: result.enhanced_message,
          autopilot: isAutoPilot,
          provider,
          agent_mode: agentMode,
        }));
        
        // Clear attachments after sending
        setAttachedFiles([]);
        setFilePreview(null);
        
      } catch (error) {
        console.error('Error sending files:', error);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: '[Error] Failed to send files. Please try again or send without attachments.'
        }]);
        return;
      }
    } else {
      // Regular text-only message via WebSocket
      ws.current.send(JSON.stringify({ message: msg, autopilot: isAutoPilot, provider, agent_mode: agentMode }));
    }
    
    setInput('');
    setIsTyping(true);
    tokenQueue.current = '';
    liveToolsRef.current = [];
    setLiveTools([]);
    setModelCards([]);
    setSelectedModel(null);
    setShowContinue(false);
  };

  const handleRetry = (index) => {
    if (!ws.current || !wsReady) return;
    const msg = messages[index].content;
    setMessages(prev => prev.slice(0, index + 1));
    ws.current.send(JSON.stringify({ message: msg, autopilot: isAutoPilot, provider, agent_mode: agentMode }));
    setIsTyping(true);
    tokenQueue.current = '';
    liveToolsRef.current = [];
    setLiveTools([]);
    setModelCards([]);
    setSelectedModel(null);
    setShowContinue(false);
  };

  // Picking a dataset row sends its canonical ref (e.g. "roboflow:wgl/eyes-open")
  // rather than the display title, so prepare_dataset gets something it can
  // actually resolve without the model having to guess at a name.
  const handleChooseDataset = (choice) => {
    if (!ws.current || !wsReady || isTyping || !choice?.ref) return;
    const text = `Use the dataset ${choice.ref}`;
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    ws.current.send(JSON.stringify({ message: text, autopilot: isAutoPilot, provider, agent_mode: agentMode }));
    setIsTyping(true);
    tokenQueue.current = '';
    liveToolsRef.current = [];
    setLiveTools([]);
    setModelCards([]);
    setSelectedModel(null);
    setShowContinue(false);
  };

  const handleModify = (index) => {
    const msg = messages[index].content;
    setInput(msg);
    editIndexRef.current = index; // remember where to truncate when user sends
    // Scroll input into focus
    setTimeout(() => document.querySelector('.command-deck-input')?.focus(), 50);
  };

  const handleStop = () => {
    if (!ws.current) return;
    try {
      if (ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ cancel: true }));
      }
    } catch (error) {
      console.warn('[AvatarInterface] cancel request failed', error);
    }
    setIsTyping(false);
    setIsAutoPilot(false);
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setShowContinue(true);
    const existingConfig = workflow.pipelineConfig || {};
    workflow.updateWorkflow({ 
      model_id: model.model_id, 
      model_name: model.name,
      pipeline_config: {
        ...existingConfig,
        task_type: model.task || 'object_detection',
        model_org: model.org,
        model_params: model.params_m,
        model_license: model.license,
        model_framework: model.framework || 'pytorch',
      }
    });
  };

  const handleContinue = () => {
    workflow.updateWorkflow({
      current_stage: 'pipeline',
      pipeline_config: { ...(workflow.pipelineConfig || {}), skip_dataset: true },
    });
    window.dispatchEvent(new CustomEvent('visioncraft-navigate', { detail: 'pipeline' }));
  };

  const hasMessages = messages.length > 0;
  const visibleTools = useMemo(() => {
    if (liveTools.length > 0) return liveTools;
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (Array.isArray(messages[index]?.tools) && messages[index].tools.length > 0) {
        return messages[index].tools;
      }
    }
    return [];
  }, [liveTools, messages]);
  const selectableModelCards = useMemo(() => modelCards.filter((model) => {
    const source = String(model?.source || '').toLowerCase();
    const org = String(model?.org || '').toLowerCase();
    return source !== 'arxiv' && source !== 'paperswithcode' && !org.includes('arxiv / research');
  }), [modelCards]);
  const latestAgentError = useMemo(() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      const content = messages[index]?.content || '';
      if (messages[index]?.role === 'assistant' && content.startsWith('[Error')) {
        return content.replace(/^\[Error:?\s*/, '').replace(/\]$/, '');
      }
    }
    return '';
  }, [messages]);
  const hasCompletedTask = useMemo(() => (
    !isTyping && messages.some((message) => {
      const content = String(message?.content || '').trim();
      return message?.role === 'assistant' && content && !content.startsWith('[Error');
    })
  ), [isTyping, messages]);

  useEffect(() => {
    onWorkspaceStateChange?.({
      provider: providerLabel,
      isTyping,
      hasCompletedTask,
      messageCount: messages.length,
      attachmentCount: attachedFiles.length,
      error: latestAgentError,
      tools: visibleTools.map((tool) => (
        typeof tool === 'string'
          ? { name: tool, label: toolLabel(tool), status: 'success' }
          : { ...tool, label: toolLabel(tool.name) }
      )),
    });
  }, [attachedFiles.length, hasCompletedTask, isTyping, latestAgentError, messages.length, onWorkspaceStateChange, providerLabel, visibleTools]);

  const chooseStarter = (prompt) => {
    setInput(prompt);
    requestAnimationFrame(() => document.querySelector('.command-deck-input')?.focus());
  };

  const renderComposer = (placement) => {
    const fileInputId = `agent-file-input-${placement}`;
    const canSend = wsReady && (input.trim() || attachedFiles.length > 0);

    return (
      <div className={`command-deck-wrapper ${placement === 'welcome' ? 'welcome-composer' : 'thread-composer'} mode-${agentMode}`}>
        <div className="command-deck">
          {connectionError && (
            <div className="connection-banner" role="status" aria-live="polite">
              <WifiOff size={12} />
              <span>{connectionError}</span>
            </div>
          )}
          {attachedFiles.length > 0 && (
            <div className="attached-files-preview">
              {attachedFiles.map((file, idx) => (
                <div key={`${file.name}-${idx}`} className="attached-file-item">
                  {file.type.startsWith('image/') && filePreview ? (
                    <img src={filePreview} alt={file.name} className="file-preview-thumb" />
                  ) : (
                    <FileText size={15} className="file-icon" />
                  )}
                  <span className="file-name">{file.name}</span>
                  <button
                    type="button"
                    className="file-remove-btn"
                    onClick={() => {
                      setAttachedFiles((previous) => previous.filter((_, fileIndex) => fileIndex !== idx));
                      if (attachedFiles.length === 1) setFilePreview(null);
                    }}
                    aria-label={`Remove ${file.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="command-deck-input-wrapper">
            <textarea
              className="command-deck-input"
              placeholder={MODE_PRESENTATION[agentMode]?.placeholder || MODE_PRESENTATION.execute.placeholder}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
              disabled={isTyping}
              aria-label="Message VisionCraft Agent"
            />

            <div className="command-deck-row2">
              <button type="button" className="deck-icon-btn" title="Attach image or document" onClick={() => document.getElementById(fileInputId)?.click()}>
                <Paperclip size={15} />
              </button>

              <input id={fileInputId} type="file" multiple accept="image/*,.pdf,.txt,.doc,.docx" hidden onChange={(event) => {
                const files = Array.from(event.target.files || []);
                if (files.length === 0) return;
                setAttachedFiles((previous) => [...previous, ...files]);
                files.forEach((file) => {
                  if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (readerEvent) => setFilePreview(readerEvent.target.result);
                    reader.readAsDataURL(file);
                  }
                });
                event.target.value = '';
              }} />

              <div className="provider-selector">
                <button
                  type="button"
                  className="env-selector"
                  onClick={() => setShowProviderPicker(!showProviderPicker)}
                  onBlur={() => setTimeout(() => setShowProviderPicker(false), 150)}
                  aria-haspopup="listbox"
                  aria-expanded={showProviderPicker}
                  title={hasConfiguredProvider ? `${providerLabel} configured` : `${providerLabel} selected; add a user key in Settings if the local service has no provider credentials`}
                >
                  <span className={`provider-option-dot ${hasConfiguredProvider ? 'online' : 'offline'}`} />
                  {providerLabel}
                  <ChevronDown size={12} />
                </button>
                {showProviderPicker && (
                  <div className="provider-dropdown" role="listbox" aria-label="AI providers">
                    {configuredProviders.map((item) => (
                      <button
                        type="button"
                        key={item.key}
                        role="option"
                        aria-selected={item.key === provider}
                        className={`provider-option ${item.key === provider ? 'active' : ''}`}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => { setProvider(item.key); setShowProviderPicker(false); }}
                      >
                        <span className="provider-option-dot online" />
                        <span className="provider-option-name">{item.label}</span>
                        {item.key === provider && <Check size={13} />}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="provider-settings-link"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => window.dispatchEvent(new CustomEvent('visioncraft-navigate', { detail: 'settings' }))}
                    >
                      <PackageOpen size={13} /> Configure providers
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                className={`autopilot-slider ${isAutoPilot ? 'active' : ''}`}
                onClick={() => { if (agentMode === 'execute') setIsAutoPilot(!isAutoPilot); }}
                role="switch"
                aria-checked={isAutoPilot}
                disabled={agentMode !== 'execute'}
                title={agentMode !== 'execute' ? 'AutoPilot is available in Execute mode' : 'Run multi-step work autonomously'}
              >
                <Zap size={12} className="autopilot-icon" />
                <span className="autopilot-label-text">AutoPilot</span>
                <span className="autopilot-slider-track"><span className="autopilot-slider-thumb" /></span>
              </button>

              <span className="composer-shortcut">⇧↵ new line</span>
              <button
                type="button"
                className={`deck-action-btn ${isTyping ? 'stopping' : canSend ? 'ready' : 'idle'}`}
                onClick={isTyping ? handleStop : handleSend}
                disabled={!isTyping && !canSend}
                title={isTyping ? 'Stop current task' : canSend ? 'Send (Enter)' : wsReady ? 'Type a message' : 'Waiting for agent connection'}
              >
                {isTyping ? <Square size={12} fill="currentColor" /> : <ArrowRight size={16} strokeWidth={2.5} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      className="avatar-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="avatar-scroll-area" ref={scrollAreaRef}>
        {!hasMessages && (
          <div className="avatar-welcome-state">
            <div className="welcome-hero">
              <span className="welcome-eyebrow">{MODE_PRESENTATION[agentMode]?.eyebrow || MODE_PRESENTATION.execute.eyebrow}</span>
              <h1 className="welcome-title">{MODE_PRESENTATION[agentMode]?.title || MODE_PRESENTATION.execute.title}</h1>
              <p className="welcome-subtitle">{MODE_PRESENTATION[agentMode]?.subtitle || MODE_PRESENTATION.execute.subtitle}</p>
            </div>
            {renderComposer('welcome')}
            <div className="welcome-templates">
              {STARTER_TASKS.map(({ title, description, prompt, icon: Icon }) => (
                <button key={title} className="template-card lock-frame" onClick={() => chooseStarter(prompt)}>
                  <span className="template-icon-chip"><Icon size={17} className="template-icon" /></span>
                  <span className="template-label">{title}</span>
                  <span className="template-description">{description}</span>
                  <span className="template-meta">Start with this brief <ArrowRight size={12} /></span>
                </button>
              ))}
            </div>
            <div className="welcome-footnote"><BookOpen size={13} /><span><strong>{activeProjectTitle || 'Project context'}</strong> keeps datasets, runs, models, and artifacts linked to this session.</span></div>
          </div>
        )}

        {hasMessages && (
          <div className="response-content">
            {messages.map((msg, idx) => {
              const isLast = idx === messages.length - 1;
              const showCursor = isTyping && isLast && msg.role === 'assistant';
              
              // Tool activity comes from structured stream events, not text markers.
              // The in-flight message shows the live timeline; finished ones show
              // whatever was stamped on them when the turn completed.
              const tools = showCursor && liveTools.length > 0 ? liveTools : (msg.tools || []);
              const cleanContent = msg.content.replace(/\n{3,}/g, '\n\n').trim();

              if (msg.role === 'user') {
                return (
                  <div key={idx} className="user-message-row">
                    <div className="user-message-wrapper">
                      <div className="user-message-header">
                        <span className="user-name">You</span>
                        <span className="message-timestamp">Just now</span>
                      </div>
                      <div className="user-message-bubble">{msg.content}</div>
                      <div className="user-message-actions">
                        <button className="user-action-btn" onClick={() => handleModify(idx)} title="Modify and send again">
                          <Edit2 size={12} />
                        </button>
                        <button className="user-action-btn" onClick={() => handleRetry(idx)} title="Retry this message">
                          <RotateCcw size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              const isError = msg.content.startsWith('[Error');
              return (
                <div key={idx} className="assistant-message-row">

                  {isError ? (
                    <div className="api-error-card">
                      <div className="api-error-header">
                        <ShieldAlert size={16} />
                        <span>Agent task failed</span>
                      </div>
                      <p className="api-error-body">
                        VisionCraft could not complete this turn. The failure is preserved here so you can retry after correcting the service or provider issue.
                      </p>
                      <div className="api-error-footer">
                        <span className="api-error-detail">{msg.content.replace(/^\[Error:?\s*/, '').replace(/\]$/, '').slice(0, 180)}</span>
                        <button className="api-error-retry" onClick={() => handleSend()}>
                          <Send size={12} /> Retry
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="assistant-response-container">
                      <div className="assistant-message-header">
                        {!isTyping && msg.content && msg.diff && (
                          <div className="assistant-diff-stats">
                            <span className="diff-add">+{msg.diff.added}</span>
                            <span className="diff-remove">-{msg.diff.removed}</span>
                          </div>
                        )}
                      </div>
                      <AgentActivityCard tools={tools} />
                      <DatasetChoices
                        tools={tools}
                        disabled={isTyping || !wsReady}
                        onChoose={handleChooseDataset}
                      />
                      {cleanContent && (
                        <AssistantContent
                          content={cleanContent.replace(/\[TOOL_NAV:[a-z_]+\]/g, '').trim()}
                          showCursor={showCursor}
                        />
                      )}
                      {!isTyping && (
                        <div className="message-actions-bar">
                          {/* Copy */}
                          <button
                            className={`message-action-btn ${copiedIdx === idx ? 'action-copied' : ''}`}
                            onClick={() => {
                              navigator.clipboard.writeText(cleanContent);
                              setCopiedIdx(idx);
                              setTimeout(() => setCopiedIdx(null), 2000);
                            }}
                            title="Copy message"
                          >
                            {copiedIdx === idx ? <Check size={14} /> : <Copy size={14} />}
                          </button>

                          <div className="action-divider" />
                        </div>
                      )}
                      
                      {!isTyping && isLast && agentMode === 'plan' && cleanContent && !isError && (
                        <div className="mode-transition-hint">
                          <div className="mode-hint-text">
                            <Sparkles size={14} className="mode-hint-icon" />
                            Plan ready. Switch to Execute mode to carry it out.
                          </div>
                          <button 
                            className="mode-hint-btn"
                            onClick={() => setAgentMode?.('execute')}
                          >
                            Switch to Execute <ArrowRight size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (messages.length === 0 || messages[messages.length - 1]?.role === 'user') && (
              <div className="assistant-message-row">

                <div className="assistant-response markdown-body">
                  {agentThinking ? (
                    <div className="agent-thinking-indicator">
                      <div className="thinking-dots">
                        <span></span><span></span><span></span>
                      </div>
                      <span className="thinking-text">Planning next steps...</span>
                    </div>
                  ) : (
                    <span className="blinking-cursor"></span>
                  )}
                </div>
              </div>
            )}

            {/* Agent Mission Control - shows parallel agent activities */}
            <AgentMissionControl agents={agents} onCancel={cancelAgent} />

            {!isTyping && selectableModelCards.length > 0 && (
              <motion.div 
                className="model-cards-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="model-cards-header">
                  <h3>Recommended Models</h3>
                  <p>Select the best model for your deployment target</p>
                </div>

                <div className="model-cards-grid">
                  {selectableModelCards.slice(0, 6).map((model, idx) => {
                    return (
                    <motion.div
                      key={model.model_id}
                      className={`model-card glass-panel ${selectedModel?.model_id === model.model_id ? 'selected' : ''}`}
                      role="button"
                      tabIndex={0}
                      aria-pressed={selectedModel?.model_id === model.model_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      onClick={() => handleModelSelect(model)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleModelSelect(model);
                        }
                      }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {selectedModel?.model_id === model.model_id && (
                        <motion.div 
                          className="card-selected-badge"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <Check size={16} />
                        </motion.div>
                      )}

                      <div className={`card-license-badge ${model.commercial_safe ? 'safe' : 'warning'}`}>
                        {model.commercial_safe ? <Zap size={12} /> : <Lock size={12} />}
                        <span>{model.license || 'Unknown'}</span>
                      </div>

                      {model.year && (
                        <div className="card-year-badge">
                          {model.year}
                        </div>
                      )}

                      <div className="card-header">
                        <Cpu size={20} className="card-icon" />
                        <div className="card-title">
                          <h4>{model.name}</h4>
                          <span className="card-org">{model.org}</span>
                        </div>
                      </div>

                      <div className="card-description">
                        {model.description || 'No description available'}
                      </div>

                      <div className="card-stats">
                        <div className="stat-item">
                          <span className="stat-label">Params</span>
                          <span className="stat-value">{model.params_m ? `${model.params_m}M` : 'N/A'}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Downloads</span>
                          <span className="stat-value">{model.downloads ? `${(model.downloads / 1000).toFixed(0)}k` : 'N/A'}</span>
                        </div>
                        {/* Published COCO figure for the pretrained checkpoint, not
                            a score this user's model earned. The backend nulls it for
                            non-detection tasks, so a bare "mAP" here read as if it
                            described whatever the user is about to train. */}
                        {typeof model.map50_95 === 'number' && (
                          <div className="stat-item">
                            <span className="stat-label" title="Published COCO val2017 mAP50-95 for the pretrained weights">
                              COCO mAP
                            </span>
                            <span className="stat-value">{model.map50_95}%</span>
                          </div>
                        )}
                      </div>

                      {(model.github || model.paper || model.onnx) && (
                        <div className="card-enhanced-info">
                          {model.github && (
                            <a 
                              href={model.github.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="card-info-link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              ⭐ {(model.github.stars / 1000).toFixed(1)}k stars
                            </a>
                          )}
                          {model.paper && (
                            <a 
                              href={model.paper.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="card-info-link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              📄 Paper
                            </a>
                          )}
                          {model.onnx?.available && (
                            <a 
                              href={model.onnx.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="card-info-link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              📦 ONNX
                            </a>
                          )}
                        </div>
                      )}

                      {model.score !== undefined && (
                        <div className="card-score">
                          <TrendingUp size={12} />
                          <span>Score: {model.score.toFixed(2)}</span>
                        </div>
                      )}

                      {!model.commercial_safe && (
                        <div className="card-warning">
                          <ShieldAlert size={12} />
                          <span>Commercial restrictions apply</span>
                        </div>
                      )}
                    </motion.div>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {showContinue && selectedModel && (
                    <motion.div 
                      className="model-cards-actions"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="selected-model-summary">
                        <Check size={16} className="check-icon" />
                        <span>Selected: <strong>{selectedModel.name}</strong> ({selectedModel.org})</span>
                      </div>
                      <button 
                        className="btn-primary continue-btn"
                        onClick={handleContinue}
                      >
                        <span>Continue to Data Pipeline</span>
                        <ChevronRight size={18} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {hasMessages && renderComposer('thread')}
    </motion.div>
  );
}



// Accepts structured events ({name, status}) and tolerates legacy plain strings
// from any messages persisted before the structured protocol landed.
const AgentActivityCard = ({ tools }) => {
  if (!tools || tools.length === 0) return null;

  const items = tools.map((t) =>
    typeof t === 'string' ? { name: t, status: 'success' } : t
  );
  const running = items.filter((t) => t.status === 'running').length;
  const failed = items.filter((t) => t.status === 'error').length;

  let title;
  if (running > 0) {
    title = toolLabel(items.find((t) => t.status === 'running').name) + '…';
  } else if (failed > 0) {
    title = `${items.length} step${items.length !== 1 ? 's' : ''}, ${failed} failed`;
  } else {
    title = `Completed ${items.length} task${items.length !== 1 ? 's' : ''}`;
  }

  return (
    <div className="agent-activity-card" role="status" aria-live="polite">
      <div className="activity-header">
        {running > 0 ? (
          <RefreshCw size={14} className="activity-icon-running spin" />
        ) : failed > 0 ? (
          <ShieldAlert size={14} className="activity-icon-error" />
        ) : (
          <CheckCircle size={14} className="activity-icon-success" />
        )}
        <span className="activity-title">{title}</span>
      </div>
      <div className="activity-timeline">
        {items.map((t, i) => (
          <div key={i} className={`timeline-item timeline-${t.status || 'success'}`}>
            <div className="timeline-node"></div>
            <div className="timeline-content">
              <span className="timeline-action">{toolLabel(t.name)}</span>
              {t.status === 'error' && <span className="timeline-badge-error">failed</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SOURCE_LABELS = { huggingface: 'HuggingFace', roboflow: 'Roboflow' };

const formatDownloads = (n) => {
  if (typeof n !== 'number' || !Number.isFinite(n)) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
};

// Selectable results for the last dataset search of a turn. Without this the
// agent asks "which of these would you like?" above a paragraph of names and the
// user has to type one back, exactly.
const DatasetChoices = ({ tools, disabled, onChoose }) => {
  const withChoices = (tools || []).filter(
    (t) => t && typeof t !== 'string' && Array.isArray(t.choices) && t.choices.length > 0
  );
  if (withChoices.length === 0) return null;

  const last = withChoices[withChoices.length - 1];
  const source = SOURCE_LABELS[last.choices[0]?.source] || 'search';

  return (
    <div className="dataset-choices" role="group" aria-label={`Datasets found on ${source}`}>
      <div className="dataset-choices-header">
        <Database size={13} />
        <span>{last.choices.length} datasets on {source}</span>
      </div>
      <ul className="dataset-choice-list">
        {last.choices.map((c) => {
          const downloads = formatDownloads(c.downloads);
          const images = formatDownloads(c.images);
          return (
            <li key={c.ref} className="dataset-choice">
              <div className="dataset-choice-main">
                <span className="dataset-choice-title">{c.title}</span>
                {c.slug && c.slug !== c.title && (
                  <span className="dataset-choice-slug">{c.slug}</span>
                )}
                {c.subtitle && <span className="dataset-choice-subtitle">{c.subtitle}</span>}
              </div>
              <div className="dataset-choice-side">
                {images && (
                  <span className="dataset-choice-metric" title={`${c.images.toLocaleString()} images`}>
                    {images} images
                  </span>
                )}
                {downloads && (
                  <span className="dataset-choice-metric" title={`${c.downloads} downloads`}>
                    {downloads} downloads
                  </span>
                )}
                {c.url && (
                  <a
                    className="dataset-choice-link"
                    href={c.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    View
                  </a>
                )}
                <button
                  type="button"
                  className="dataset-choice-use"
                  disabled={disabled}
                  onClick={() => onChoose(c)}
                >
                  Use this
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

DatasetChoices.propTypes = {
  tools: PropTypes.array,
  disabled: PropTypes.bool,
  onChoose: PropTypes.func.isRequired,
};

AvatarInterface.propTypes = {
  activeSessionId: PropTypes.number,
  activeProjectId: PropTypes.number,
  activeProjectTitle: PropTypes.string,
  agentMode: PropTypes.oneOf(['plan', 'execute', 'review']).isRequired,
  setAgentMode: PropTypes.func,
  onWorkspaceStateChange: PropTypes.func,
};

export default memo(AvatarInterface);
