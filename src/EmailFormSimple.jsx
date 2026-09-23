import { useId, useState } from 'react'
import { CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react'
import { useLanguage } from './useLanguage'

/* Progressive collection form - quick email capture, then ask for more details */
export default function EmailFormSimple({
  endpoint,
  source,
  buttonLabel,
  placeholder,
  successTitle,
  successBody,
  consent,
  compact = false,
}) {
  const { t } = useLanguage()
  const [step, setStep] = useState('email') // email, details, success
  const [email, setEmail] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    useCase: '',
  })
  const [userType, setUserType] = useState('company')
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  
  const fieldId = useId()
  const errId = `${fieldId}-err`

  const demoMode = !endpoint || endpoint.includes('YOUR_FORM_ID')

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const showInvalid = touched.email && email && !validateEmail(email)

  const handleChange = (field) => (e) => {
    if (field === 'email') {
      setEmail(e.target.value)
    } else {
      setFormData({ ...formData, [field]: e.target.value })
    }
    setError('')
  }

  const handleBlur = (field) => () => {
    setTouched({ ...touched, [field]: true })
  }

  const submitEmail = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError(t.form.errorEmail)
      setTouched({ ...touched, email: true })
      return
    }
    if (!validateEmail(email)) {
      setError(t.form.errorEmailInvalid)
      setTouched({ ...touched, email: true })
      return
    }

    if (compact) {
      // In compact mode (like the footer newsletter), skip the details step
      setStatus('submitting')
      if (demoMode) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setStep('success')
        setStatus('idle')
        return
      }

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            source: source || 'newsletter',
            timestamp: new Date().toISOString(),
          }),
        })

        if (!response.ok) throw new Error('Submission failed')

        setStep('success')
        setStatus('idle')
      } catch (err) {
        setStatus('error')
        setError('Something went wrong. Please try again.')
      }
      return
    }

    // Move to details step
    setStep('details')
    setError('')
  }

  const submitDetails = async (e) => {
    e.preventDefault()
    setError('')

    // Validate name
    if (!formData.name.trim()) {
      setError(t.form.errorName)
      setTouched({ ...touched, name: true })
      return
    }

    setStatus('submitting')

    // Demo mode
    if (demoMode) {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setStep('success')
      setStatus('idle')
      return
    }

    // Real submission with full data
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: formData.name,
          company: formData.company,
          useCase: formData.useCase,
          userType,
          source: source || 'landing',
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      setStep('success')
      setStatus('idle')
    } catch (err) {
      setStatus('error')
      setError(t.form.errorGeneric)
    }
  }

  const reset = () => {
    setStep('email')
    setEmail('')
    setFormData({ name: '', company: '', useCase: '' })
    setUserType('company')
    setTouched({})
    setStatus('idle')
    setError('')
  }

  // Success state
  if (step === 'success') {
    return (
      <div className="lp-success-panel" role="status" aria-live="polite">
        <CheckCircle className="lp-check" size={22} aria-hidden="true" />
        <div>
          <h4>{successTitle}</h4>
          <p>
            {demoMode
              ? t.form.successBodyDemo
              : (successBody || t.form.successBody)}
          </p>
          <button
            type="button"
            className="lp-btn lp-btn-ghost"
            style={{ height: 34, padding: '0 12px', marginTop: 10 }}
            onClick={reset}
          >
            {t.form.addAnother}
          </button>
        </div>
      </div>
    )
  }

  // Step 2: Details collection
  if (step === 'details') {
    return (
      <div className="lp-form-enhanced lp-form-progressive">
        <p className="lp-form-progress-text">
          {t.form.progressText}
        </p>

        {/* User Type Toggle */}
        <div className="lp-form-toggle">
          <button
            type="button"
            className={`lp-toggle-btn ${userType === 'company' ? 'active' : ''}`}
            onClick={() => setUserType('company')}
          >
            {t.form.companyType}
          </button>
          <button
            type="button"
            className={`lp-toggle-btn ${userType === 'individual' ? 'active' : ''}`}
            onClick={() => setUserType('individual')}
          >
            {t.form.individualType}
          </button>
        </div>

        <form onSubmit={submitDetails} noValidate style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
          <div className="lp-form-grid">
            <div className="lp-form-group">
              <label htmlFor={`${fieldId}-name`} className="lp-form-label">
                {t.form.name} *
              </label>
              <input
                id={`${fieldId}-name`}
                className={`lp-field ${touched.name && !formData.name.trim() ? 'invalid' : ''}`}
                type="text"
                autoComplete="name"
                placeholder={t.form.namePlaceholder}
                value={formData.name}
                onChange={handleChange('name')}
                onBlur={handleBlur('name')}
                disabled={status === 'submitting'}
                autoFocus
              />
            </div>

            {userType === 'company' && (
              <div className="lp-form-group">
                <label htmlFor={`${fieldId}-company`} className="lp-form-label">
                  {t.form.company}
                </label>
                <input
                  id={`${fieldId}-company`}
                  className="lp-field"
                  type="text"
                  autoComplete="organization"
                  placeholder={t.form.companyPlaceholder}
                  value={formData.company}
                  onChange={handleChange('company')}
                  onBlur={handleBlur('company')}
                  disabled={status === 'submitting'}
                />
              </div>
            )}

            <div className="lp-form-group" style={{ gridColumn: userType === 'individual' ? 'span 2' : 'auto' }}>
              <label htmlFor={`${fieldId}-usecase`} className="lp-form-label">
                {t.form.useCase}
              </label>
              <select
                id={`${fieldId}-usecase`}
                className="lp-field lp-select"
                value={formData.useCase}
                onChange={handleChange('useCase')}
                onBlur={handleBlur('useCase')}
                disabled={status === 'submitting'}
              >
                <option value="">{t.form.useCasePlaceholder}</option>
                {Object.entries(t.form.useCases).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="lp-form-actions">
            <button
              type="button"
              className="lp-btn lp-btn-ghost"
              onClick={() => setStep('email')}
              disabled={status === 'submitting'}
            >
              {t.form.back}
            </button>
            <button type="submit" className="lp-btn lp-btn-primary" disabled={status === 'submitting'}>
              {status === 'submitting' ? (
                <>
                  <Loader2 className="lp-spin" size={17} aria-hidden="true" />
                  {t.form.submitting}
                </>
              ) : (
                <>
                  {t.form.completeSignup}
                  <ArrowRight size={16} aria-hidden="true" />
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="lp-form-msg" aria-live="polite">
              <span id={errId} className="lp-form-msg-error" role="alert">
                <AlertCircle size={15} aria-hidden="true" />
                {error}
              </span>
            </div>
          )}
        </form>
      </div>
    )
  }

  // Step 1: Email collection
  return (
    <form className="lp-form" onSubmit={submitEmail} noValidate>
      <div className="lp-form-row">
        <label htmlFor={fieldId} className="lp-visually-hidden">
          Email address
        </label>
        <input
          id={fieldId}
          className={`lp-field ${showInvalid ? 'invalid' : ''}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={placeholder}
          value={email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
          aria-invalid={showInvalid || status === 'error'}
          aria-describedby={error ? errId : undefined}
          disabled={status === 'submitting'}
        />
        <button type="submit" className="lp-btn lp-btn-primary" disabled={status === 'submitting'}>
          {status === 'submitting' ? (
            <>
              <LoaderCircle className="lp-spin" size={17} aria-hidden="true" />
              {t.form.submitting}
            </>
          ) : (
            <>
              {buttonLabel || t.form.submit}
              {!compact && <ArrowRight size={16} aria-hidden="true" />}
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="lp-form-msg" aria-live="polite">
          <span id={errId} className="lp-form-msg-error" role="alert">
            <AlertCircle size={15} aria-hidden="true" />
            {error}
          </span>
        </div>
      )}

      {consent && <p className="lp-form-consent">{consent}</p>}
    </form>
  )
}
