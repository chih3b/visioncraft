import { useEffect, useRef } from 'react'
import { VERT, FRAG } from './depthFieldShaders'

/* ============================================================================
   DepthField — the page's signature element, in ~one draw call.
   ----------------------------------------------------------------------------
   A ~29k-point cloud that lifts from a flat sheet into 3D relief. Written
   against raw WebGL because three.js isn't a dependency here and this needs
   about 2% of its surface area.

   Behaviour it is careful about:
   • pauses its rAF loop when scrolled out of view (IntersectionObserver)
   • caps DPR at 2 so 5K displays don't melt
   • prefers-reduced-motion → draws ONE static frame, never starts a loop
   • no WebGL / context lost → renders nothing and leaves the CSS backdrop alone
   • cleans up program, buffers and context on unmount

   `morphRef` is a plain { current: number } the parent writes to from scroll,
   deliberately not React state — this must not re-render on every frame.
   ========================================================================== */

const MAX_DPR = 2

function perspective(fovy, aspect, near, far) {
  const f = 1 / Math.tan(fovy / 2)
  const nf = 1 / (near - far)
  // column-major, as WebGL expects
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ])
}

function compile(gl, type, source) {
  const sh = gl.createShader(type)
  gl.shaderSource(sh, source)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    // Surfaced in dev; never throws at the user.
    console.warn('[DepthField] shader compile failed:', gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

/* One static grid: positions on the plane + a per-point random seed. */
function buildGrid(side, extent) {
  const count = side * side
  const grid = new Float32Array(count * 2)
  const seed = new Float32Array(count)
  let i = 0
  for (let y = 0; y < side; y++) {
    for (let x = 0; x < side; x++) {
      // Jitter breaks up the regular lattice so it reads as sampled data,
      // not as graph paper.
      const jx = (Math.random() - 0.5) * 0.9
      const jy = (Math.random() - 0.5) * 0.9
      grid[i * 2] = ((x + 0.5 + jx) / side * 2 - 1) * extent
      grid[i * 2 + 1] = ((y + 0.5 + jy) / side * 2 - 1) * extent
      seed[i] = Math.random()
      i++
    }
  }
  return { grid, seed, count }
}

export default function DepthField({ className = '', morphRef, density = 170 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const gl =
      canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false }) ||
      canvas.getContext('experimental-webgl')
    if (!gl) return // no WebGL: the CSS backdrop stands on its own

    /* --- program ------------------------------------------------------- */
    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return

    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('[DepthField] link failed:', gl.getProgramInfoLog(prog))
      return
    }
    gl.useProgram(prog)

    /* --- geometry ------------------------------------------------------ */
    const side = Math.max(60, Math.min(density, 220))
    const { grid, seed, count } = buildGrid(side, 1.62)

    const aGrid = gl.getAttribLocation(prog, 'aGrid')
    const gridBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, gridBuf)
    gl.bufferData(gl.ARRAY_BUFFER, grid, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(aGrid)
    gl.vertexAttribPointer(aGrid, 2, gl.FLOAT, false, 0, 0)

    const aSeed = gl.getAttribLocation(prog, 'aSeed')
    const seedBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, seedBuf)
    gl.bufferData(gl.ARRAY_BUFFER, seed, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(aSeed)
    gl.vertexAttribPointer(aSeed, 1, gl.FLOAT, false, 0, 0)

    const u = {
      proj: gl.getUniformLocation(prog, 'uProj'),
      time: gl.getUniformLocation(prog, 'uTime'),
      morph: gl.getUniformLocation(prog, 'uMorph'),
      reveal: gl.getUniformLocation(prog, 'uReveal'),
      pointer: gl.getUniformLocation(prog, 'uPointer'),
      dpr: gl.getUniformLocation(prog, 'uDpr'),
      base: gl.getUniformLocation(prog, 'uBase'),
      accent: gl.getUniformLocation(prog, 'uAccent'),
    }

    // Straight from the Pure Carbon palette: dim cool white → #5cefff.
    gl.uniform3f(u.base, 0.60, 0.62, 0.70)
    gl.uniform3f(u.accent, 0.655, 0.545, 0.98)

    // Additive over the near-black canvas: luminous without a bloom pass,
    // and no depth sorting to get wrong.
    gl.disable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
    gl.clearColor(0, 0, 0, 0)

    /* --- sizing -------------------------------------------------------- */
    let dpr = 1
    function resize() {
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform1f(u.dpr, dpr)
      gl.uniformMatrix4fv(u.proj, false, perspective(0.92, rect.width / rect.height, 0.1, 12))
    }
    resize()

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    ro?.observe(canvas)
    window.addEventListener('resize', resize)

    /* --- pointer (damped, never per-frame React state) ------------------ */
    const target = { x: 0, y: 0 }
    const eased = { x: 0, y: 0 }
    function onPointer(e) {
      target.x = (e.clientX / window.innerWidth) * 2 - 1
      target.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    if (!reduced) window.addEventListener('pointermove', onPointer, { passive: true })

    /* --- draw ----------------------------------------------------------- */
    function draw(time, reveal, morph) {
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform1f(u.time, time)
      gl.uniform1f(u.reveal, reveal)
      gl.uniform1f(u.morph, morph)
      gl.uniform2f(u.pointer, eased.x, eased.y)
      gl.drawArrays(gl.POINTS, 0, count)
    }

    // Reduced motion: one composed frame, fully revealed, no loop at all.
    if (reduced) {
      draw(0, 1, 1)
      return () => {
        ro?.disconnect()
        window.removeEventListener('resize', resize)
        gl.deleteBuffer(gridBuf)
        gl.deleteBuffer(seedBuf)
        gl.deleteProgram(prog)
      }
    }

    let raf = 0
    let visible = true
    let start = 0
    let last = 0

    function frame(now) {
      raf = requestAnimationFrame(frame)
      if (!start) start = now
      const t = (now - start) / 1000
      const dt = Math.min((now - (last || now)) / 1000, 0.05)
      last = now

      // Critically damped follow — cursor influence without jitter.
      const k = 1 - Math.pow(0.0015, dt)
      eased.x += (target.x - eased.x) * k
      eased.y += (target.y - eased.y) * k

      const reveal = Math.min(t / 1.6, 1)
      const morph = morphRef ? morphRef.current : 1
      draw(t, reveal, morph)
    }

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([entry]) => {
              const nowVisible = entry.isIntersecting
              if (nowVisible === visible) return
              visible = nowVisible
              if (visible) {
                last = 0
                raf = requestAnimationFrame(frame)
              } else {
                cancelAnimationFrame(raf)
                raf = 0
              }
            },
            { rootMargin: '120px' }
          )
        : null

    if (io) io.observe(canvas)
    raf = requestAnimationFrame(frame)

    function onLost(e) {
      e.preventDefault()
      cancelAnimationFrame(raf)
      raf = 0
    }
    canvas.addEventListener('webglcontextlost', onLost)

    return () => {
      cancelAnimationFrame(raf)
      io?.disconnect()
      ro?.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      canvas.removeEventListener('webglcontextlost', onLost)
      gl.deleteBuffer(gridBuf)
      gl.deleteBuffer(seedBuf)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [density, morphRef])

  return <canvas ref={canvasRef} className={`lp-depthfield ${className}`.trim()} aria-hidden="true" />
}
