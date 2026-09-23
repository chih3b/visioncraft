import { useState } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(v) {
  return EMAIL_RE.test((v || '').trim())
}

/* Shared email-capture logic for the waitlist and newsletter forms.
   States: idle → submitting → success | error, plus inline validation.

   Honesty note: the marketing site has no backend of its own, so when no
   `endpoint` is configured the hook runs in demoMode — it validates and shows
   the success state but never claims the address was stored. Wire CONFIG.*
   endpoints (Formspree, Buttondown, a serverless fn, …) to go live. */
export function useEmailForm({ endpoint, source } = {}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)

  const demoMode = !endpoint
  const showInvalid = touched && email.trim().length > 0 && !isValidEmail(email)

  async function submit(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()
    setTouched(true)
    const value = email.trim()

    if (!isValidEmail(value)) {
      setStatus('error')
      setError('Enter a valid email address.')
      return
    }

    setStatus('submitting')
    setError('')

    if (demoMode) {
      // No endpoint set — simulate the round-trip so the UI is demoable, but
      // the success copy will tell the user nothing was stored yet.
      await new Promise((r) => setTimeout(r, 650))
      setStatus('success')
      return
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: value, source }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError('Something went wrong on our end. Please try again in a moment.')
    }
  }

  function reset() {
    setEmail('')
    setStatus('idle')
    setError('')
    setTouched(false)
  }

  return { email, setEmail, status, error, submit, reset, demoMode, showInvalid, setTouched }
}
