import { useEffect, useRef, useState } from 'react'
import {
  motion, AnimatePresence, useReducedMotion, useMotionValue, useSpring, useMotionValueEvent
} from 'framer-motion'
import {
  Wrench, Activity, Rocket, MonitorPlay, Settings, LogOut,
  MessageSquare, Layers, Cpu, Server, Crosshair, Code2,
  Plus, Search, PanelRightOpen, X, RefreshCw, CircleCheck,
  Paperclip, ChevronDown, ChevronUp, Zap, ArrowRight, User,
} from 'lucide-react'
import VisionCraftLogo from '../components/avatar/VisionCraftLogo'
import { SHELL, PREVIEW_MODES, COMPOSER } from '../content'

/* ============================================================================
   ProductPreview — the real app, rebuilt from its own stylesheets.
   ----------------------------------------------------------------------------
   Every measurement below was read out of DashboardLayout.css and
   AvatarInterface.css rather than estimated, because a mockup that invents its
   own chrome is worse than no mockup at all. The load-bearing facts:

     · four columns in DOM order — 56px rail, 260px sidebar, workspace,
       300px inspector, and the inspector's border-left is the shell's only one
     · the rail is icon-only (.rail-label { display:none }); .rail-top has
       margin-top:44px for the traffic lights; the LOGO SITS LAST in that
       stack; the active area is marked by a 2px accent bar at left:-8px
     · the sidebar header is a small uppercase label, not a title
     · nav shortcuts are opacity:0 at rest and only appear on hover/active
     · 32px drag strip, then a 48px topbar holding a centred 500px search
       trigger with the actions absolutely positioned right — no breadcrumb
     · the mode header is centre-aligned: tabs, then the hint underneath
     · the active mode tab is rgba(255,255,255,0.08) — not an accent fill
     · the user row is row-reverse (28px avatar on the right) with the bubble's
       top-right corner tucked in; the assistant is flat prose, no avatar
     · AgentActivityCard is a dot-rail of label-only steps at max-width 85%
     · the command deck is the one blurred surface in the whole app

   The mode tabs are genuinely interactive and arrow-key navigable.
   ========================================================================== */

const AREA_ICONS = { Wrench, Activity, Rocket, MonitorPlay }
const NAV_ICONS = { MessageSquare, Layers, Activity, Cpu, Server, Crosshair, Code2, MonitorPlay }

/* ConfidenceBar's real thresholds, from components/common/ConfidenceBar.jsx. */
function confidenceColor(v) {
  if (v >= 0.8) return '#22c55e'
  if (v >= 0.6) return '#eab308'
  if (v >= 0.4) return '#f97316'
  return '#ef4444'
}

export default function ProductPreview({ exploded = false, scrollProgress = null }) {
  const reduced = useReducedMotion()
  // 'execute' is the app's own default agentMode.
  const [modeId, setModeId] = useState('execute')
  const tabRefs = useRef([])
  const index = Math.max(0, PREVIEW_MODES.findIndex((m) => m.id === modeId))
  const mode = PREVIEW_MODES[index]

  /* ── Orbit ────────────────────────────────────────────────────────────────
     When the shell is exploded, dragging (or the arrow keys, when the frame
     itself is focused) rotates the whole assembly. The angles are clamped so
     the layers never rotate far enough to become unreadable, and spring-damped
     so it has the weight of turning a real object rather than a snap. */
  const CLAMP_Y = 26
  const CLAMP_X = 16
  const orbitX = useMotionValue(0) // rotateX, degrees
  const orbitY = useMotionValue(0) // rotateY, degrees
  const rx = useSpring(orbitX, { stiffness: 120, damping: 20, mass: 0.6 })
  const ry = useSpring(orbitY, { stiffness: 120, damping: 20, mass: 0.6 })
  const drag = useRef(null)
  const clamp = (v, m) => Math.max(-m, Math.min(m, v))

  // Explode settles into a three-quarter view so the depth reads at a glance;
  // collapse returns it square-on. Drag/keys take over from the resting angle.
  useEffect(() => {
    if (exploded) {
      orbitX.set(15)
      orbitY.set(-35)
    } else {
      orbitX.set(0)
      orbitY.set(0)
    }
  }, [exploded, orbitX, orbitY])

  function onPointerDown(e) {
    if (!exploded) return
    drag.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  function onPointerMove(e) {
    if (!exploded || !drag.current) return
    const dx = e.clientX - drag.current.x
    const dy = e.clientY - drag.current.y
    drag.current = { x: e.clientX, y: e.clientY }
    orbitY.set(clamp(orbitY.get() + dx * 0.4, CLAMP_Y))
    orbitX.set(clamp(orbitX.get() - dy * 0.4, CLAMP_X))
  }
  function onPointerUp(e) {
    drag.current = null
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }
  // Arrow keys orbit only when the frame itself holds focus, so they never
  // collide with the mode-tab roving arrows one layer in.
  function onOrbitKeyDown(e) {
    if (!exploded || e.target !== e.currentTarget) return
    const STEP = 6
    let handled = true
    if (e.key === 'ArrowLeft') orbitY.set(clamp(orbitY.get() - STEP, CLAMP_Y))
    else if (e.key === 'ArrowRight') orbitY.set(clamp(orbitY.get() + STEP, CLAMP_Y))
    else if (e.key === 'ArrowUp') orbitX.set(clamp(orbitX.get() - STEP, CLAMP_X))
    else if (e.key === 'ArrowDown') orbitX.set(clamp(orbitX.get() + STEP, CLAMP_X))
    else handled = false
    if (handled) e.preventDefault()
  }

  // Roving tabindex: one tab in the tab order, arrows move between them.
  function onTabKeyDown(e) {
    const last = PREVIEW_MODES.length - 1
    let next = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = index === last ? 0 : index + 1
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = index === 0 ? last : index - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    if (next === null) return
    e.preventDefault()
    setModeId(PREVIEW_MODES[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <motion.div
      className={`lp-app ${exploded ? 'is-exploded' : ''}`.trim()}
      style={reduced ? undefined : { rotateX: rx, rotateY: ry }}
      role={exploded ? 'group' : undefined}
      aria-label={
        exploded
          ? 'Exploded view of the app layout. Drag, or focus this frame and use the arrow keys, to rotate.'
          : undefined
      }
      tabIndex={exploded ? 0 : -1}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onOrbitKeyDown}
    >
      {/* ── Column 1 · primary rail ── */}
      <nav className="lp-app-rail" aria-hidden="true" data-plane="Rail">
        <div className="lp-rail-top">
          {SHELL.areas.map((a) => {
            const Icon = AREA_ICONS[a.icon] ?? Wrench
            return (
              <span key={a.key} className={`lp-rail-action ${a.key === 'build' ? 'active' : ''}`}>
                <Icon size={20} />
              </span>
            )
          })}
          {/* Last in the stack, exactly as in .rail-top. */}
          <span className="lp-rail-logo">
            <VisionCraftLogo size={20} monochrome />
          </span>
        </div>
        <div className="lp-rail-bottom">
          <span className="lp-rail-action"><Settings size={20} /></span>
          <span className="lp-rail-action"><LogOut size={20} /></span>
        </div>
      </nav>

      {/* ── Column 2 · context sidebar ── */}
      <aside className="lp-app-sidebar" aria-hidden="true" data-plane="Context">
        <div className="lp-ctx-header">
          <span className="lp-ctx-title">Build</span>
          <span className="lp-ctx-icon-btn"><Plus size={16} /></span>
        </div>

        <div className="lp-ctx-content">
          <div className="lp-secondary-nav">
            {SHELL.nav.build.map((item) => {
              const Icon = NAV_ICONS[item.icon] ?? MessageSquare
              return (
                <span
                  key={item.key}
                  className={`lp-nav-item ${item.key === 'orchestrator' ? 'active' : ''}`}
                >
                  <Icon size={16} />
                  <span className="lp-nav-item-label">{item.label}</span>
                  <span className="lp-nav-shortcut">{item.shortcut}</span>
                </span>
              )
            })}
          </div>

          <span className="lp-sidebar-divider" />

          <div className="lp-ctx-actions">
            <span className="lp-btn-new-conversation">
              <Plus size={14} /> {SHELL.newConversation}
            </span>
          </div>

          <div className="lp-projects-list">
            {SHELL.projects.map((p) => (
              <div className="lp-project-group" key={p.title}>
                <span className={`lp-project-header ${p.active ? 'expanded' : ''}`}>
                  <span className="status-dot" />
                  <span className="lp-project-title">{p.title}</span>
                  {p.active
                    ? <ChevronUp size={14} className="lp-expand-icon" />
                    : <ChevronDown size={14} className="lp-expand-icon" />}
                </span>

                {p.active && (
                  <div className="lp-session-list">
                    {SHELL.sessionGroups.map((g) => (
                      <div className="lp-session-group" key={g.label}>
                        <span className="lp-session-group-label">{g.label}</span>
                        {g.sessions.map((s) => (
                          <span
                            key={s.title}
                            className={`lp-session-item ${s.active ? 'active' : ''}`}
                          >
                            <MessageSquare
                              size={14}
                              className={`lp-session-icon ${s.active ? 'lp-session-running' : ''}`}
                            />
                            <span className="lp-session-title">{s.title}</span>
                            <span className="lp-session-time">{s.time}</span>
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Column 3 · workspace ── */}
      <main className="lp-app-workspace" data-plane="Workspace">
        {/* The 32px drag strip. Empty in the app too — it only exists to move
            the window, which is why the topbar starts below it. */}
        <div className="lp-titlebar-drag" aria-hidden="true" />

        <div className="lp-workspace-topbar" aria-hidden="true">
          <div className="lp-topbar-search">
            <span className="lp-search-trigger">
              <Search size={14} />
              <span className="lp-search-text">{SHELL.searchPlaceholder}</span>
              <kbd>{SHELL.searchKbd}</kbd>
            </span>
          </div>
          <div className="lp-topbar-actions">
            <span className="lp-training-mini">
              <Activity size={14} />
              <span>Training 78%</span>
            </span>
            <span className="lp-inspector-toggle"><PanelRightOpen size={18} /></span>
          </div>
        </div>

        <div className="lp-workspace-pane">
          {/* Centre-aligned, tabs above the hint — the real .agent-mode-header. */}
          <div className="lp-agent-mode-header">
            <div
              className="lp-mode-tabs"
              role="tablist"
              aria-label="Agent mode"
              onKeyDown={onTabKeyDown}
            >
              {PREVIEW_MODES.map((m, i) => {
                const selected = m.id === modeId
                return (
                  <button
                    key={m.id}
                    ref={(el) => { tabRefs.current[i] = el }}
                    type="button"
                    role="tab"
                    id={`lp-mode-tab-${m.id}`}
                    aria-selected={selected}
                    aria-controls="lp-agent-transcript"
                    tabIndex={selected ? 0 : -1}
                    className={`lp-mode-tab ${selected ? 'active' : ''}`}
                    onClick={() => setModeId(m.id)}
                  >
                    {m.label}
                  </button>
                )
              })}
            </div>
            <p className="lp-mode-hint">{mode.hint}</p>
          </div>

          <div
            className="lp-scroll-area"
            id="lp-agent-transcript"
            role="tabpanel"
            aria-labelledby={`lp-mode-tab-${mode.id}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mode.id}
                className="lp-thread"
                /* The app's own transition, verbatim: opacity + y + blur. */
                initial={reduced ? false : { opacity: 0, y: 15, filter: 'blur(8px)' }}
                animate={reduced ? false : { opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={reduced ? false : { opacity: 0, y: -15, filter: 'blur(8px)' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {/* row-reverse: avatar renders first but sits on the right. */}
                <div className="lp-user-row">
                  <span className="lp-user-avatar"><User size={18} /></span>
                  <div className="lp-user-wrapper">
                    <span className="lp-user-header">
                      <span className="lp-user-name">You</span>
                      <span className="lp-msg-time">Just now</span>
                    </span>
                    <span className="lp-user-bubble">{mode.prompt}</span>
                  </div>
                </div>

                {/* Assistant: flat prose. No bubble, no avatar, no name. */}
                <div className="lp-assistant-row">
                  {mode.activity && <ActivityCard activity={mode.activity} />}

                  <p className="lp-assistant-text">
                    {mode.reply}
                    {mode.streaming && <span className="lp-caret">▍</span>}
                  </p>

                  {mode.plan && (
                    <ol className="lp-assistant-list">
                      {mode.plan.map((s) => <li key={s}>{s}</li>)}
                    </ol>
                  )}

                  {mode.log && <p className="lp-assistant-log">{mode.log}</p>}

                  {mode.findings && (
                    <div className="lp-findings">
                      {mode.findings.map((f) => {
                        const pct = Math.round(f.value * 100)
                        const color = confidenceColor(f.value)
                        return (
                          <div className="lp-finding" key={f.label}>
                            <span className="lp-finding-label">{f.label}</span>
                            <span className="lp-conf-track">
                              <motion.span
                                className="lp-conf-fill"
                                style={{ background: color }}
                                initial={reduced ? { width: `${pct}%` } : { width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.55, delay: 0.2, ease: 'easeOut' }}
                              />
                            </span>
                            <span className="lp-finding-val" style={{ color }}>{pct}%</span>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {mode.note && <p className="lp-assistant-note">{mode.note}</p>}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* The command deck — the one frosted surface in the app. */}
          <div className="lp-deck-wrapper" aria-hidden="true">
            <div className="lp-deck">
              <span className="lp-deck-input">{COMPOSER.placeholder}</span>
              <div className="lp-deck-row2">
                <span className="lp-deck-icon"><Paperclip size={16} /></span>
                <span className="lp-env-selector">
                  {COMPOSER.providers.find((p) => p.id === COMPOSER.defaultProvider)?.label}
                  <ChevronDown size={12} />
                </span>
                <span className="lp-autopilot active">
                  <Zap size={13} className="lp-autopilot-icon" />
                  <span className="lp-autopilot-label">{COMPOSER.autopilotLabel}</span>
                  <span className="lp-autopilot-track"><i /></span>
                </span>
                <span className="lp-deck-send"><ArrowRight size={16} strokeWidth={2.5} /></span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Column 4 · inspector ── */}
      <aside className="lp-app-inspector" aria-hidden="true" data-plane="Inspector">
        <div className="lp-inspector-header">
          <span className="lp-inspector-title">{SHELL.inspectorTitle}</span>
          <span className="lp-inspector-close"><X size={18} /></span>
        </div>
        <div className="lp-inspector-content">
          <div className="lp-inspector-metric">
            <span className="lp-metric-label">Progress</span>
            <span className="lp-metric-value">78%</span>
            <span className="lp-metric-bar"><i style={{ width: '78%' }} /></span>
          </div>
          <div className="lp-inspector-metric">
            <span className="lp-metric-label">Epoch</span>
            <span className="lp-metric-value">62 <em>/ 80</em></span>
          </div>
          <div className="lp-inspector-metric">
            <span className="lp-metric-label">Loss</span>
            <span className="lp-metric-value">0.0421</span>
          </div>
          <div className="lp-inspector-metric">
            <span className="lp-metric-label">mAP50-95</span>
            <span className="lp-metric-value">0.847</span>
          </div>
          <div className="lp-inspector-log">
            <span className="lp-inspector-log-head">
              Execution log
              <span className="lp-inspector-badge">live</span>
            </span>
            <span className="lp-inspector-log-line">[INFO] epoch 62 · 0.0421</span>
            <span className="lp-inspector-log-line">[INFO] val mAP50-95 0.847</span>
          </div>
        </div>
      </aside>
    </motion.div>
  )
}

/* AgentActivityCard: a header icon plus a computed title, then a dot-rail of
   label-only steps joined by a 1px connector. No durations, no progress bars,
   nothing collapsible — only a failing step gets a badge. */
function ActivityCard({ activity }) {
  const reduced = useReducedMotion()
  const running = activity.state === 'running'

  return (
    <div className="lp-activity-card" role="status">
      <div className="lp-activity-header">
        {running
          ? <RefreshCw size={14} className={reduced ? 'lp-activity-running' : 'lp-activity-running lp-spin'} />
          : <CircleCheck size={14} className="lp-activity-success" />}
        <span className="lp-activity-title">{activity.title}</span>
      </div>
      <div className="lp-activity-timeline">
        {activity.steps.map((s) => (
          <div className={`lp-timeline-item lp-timeline-${s.status}`} key={s.label}>
            <span className="lp-timeline-node" />
            <span className="lp-timeline-action">{s.label}</span>
            {s.status === 'error' && <span className="lp-timeline-badge">failed</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
