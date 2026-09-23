import { useEffect, useRef, useState } from 'react'

/* Adds `.in` once an element scrolls into view. One-shot (unobserves after
   firing) so nothing animates on the way back out. Under prefers-reduced-motion
   the CSS neutralises the transform, so this only toggles a class either way. */
export function useReveal(options = {}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || shown) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px', ...options }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [shown, options])

  return [ref, shown]
}

/* Convenience wrapper: <Reveal as="section" className="…">…</Reveal> */
export function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const [ref, shown] = useReveal()
  return (
    <Tag ref={ref} className={`lp-reveal ${shown ? 'in' : ''} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  )
}
