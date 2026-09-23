import { useId, useState } from 'react'
import { CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react'
import { useLanguage } from './useLanguage'

/* Enhanced waitlist form with name, email, company, and use-case fields.
   All four states are real: inline validation, a loading spinner, a success
   panel, and an error message. */
export default function EmailForm({
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
  const [userType, setUserType] = useState('company') // company or individual
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    useCase: '',
  })
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

  const showInvalidEmail = touched.email && formData.email && !validateEmail(formData.email)

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value })
    setError('')
  }

  const handleBlur = (field) => () => {
    setTouched({ ...touched, [field]: true })
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate all fields
    if (!formData.name.trim()) {
      setError(t.form.errorName)
      setTouched({ ...touched, name: true })
      return
    }
    if (!formData.email.trim()) {
      setError(t.form.errorEmail)
      setTouched({ ...touched, email: true })
      return
    }
    if (!validateEmail(formData.email)) {
      setError(t.form.errorEmailInvalid)
      setTouched({ ...touched, email: true })
      return
    }

    setStatus('submitting')

    // Demo mode
    if (demoMode) {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setStatus('success')
      return
    }

    // Real submission
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userType,
          source: source || 'landing',
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(t.form.errorGeneric)
    }
  }

  const reset = () => {
    setUserType('company')
    setFormData({ name: '', email: '', company: '', useCase: '' })
    setTouched({})
    setStatus('idle')
    setError('')
  }

  if (status === 'success') {
    return (
      <div className="lp-success-panel" role="status" aria-live="polite">
        <CheckCircle className="lp-check" size={22} aria-hidden="true" />
        <div>
          <h4>{successTitle || t.form.successTitle}</h4>
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

  return (
    <form className="lp-form lp-form-enhanced" onSubmit={submit} noValidate>
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
          />
        </div>

        <div className="lp-form-group">
          <label htmlFor={`${fieldId}-email`} className="lp-form-label">
            {t.form.email} *
          </label>
          <input
            id={`${fieldId}-email`}
            className={`lp-field ${showInvalidEmail ? 'invalid' : ''}`}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={placeholder || t.form.emailPlaceholder}
            value={formData.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            aria-invalid={showInvalidEmail || status === 'error'}
            aria-describedby={error ? errId : undefined}
            disabled={status === 'submitting'}
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

        <div className="lp-form-group">
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
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" className="lp-btn lp-btn-primary lp-btn-full" disabled={status === 'submitting'}>
        {status === 'submitting' ? (
          <>
            <Loader2 className="lp-spin" size={17} aria-hidden="true" />
            {t.form.submitting}
          </>
        ) : (
          <>
            {buttonLabel || t.form.submit}
            <ArrowRight size={16} aria-hidden="true" />
          </>
        )}
      </button>

      <div className="lp-form-msg" aria-live="polite">
        {status === 'error' && error && (
          <span id={errId} className="lp-form-msg-error" role="alert">
            <AlertCircle size={15} aria-hidden="true" />
            {error}
          </span>
        )}
      </div>

      {consent && <p className="lp-form-consent">{consent}</p>}
    </form>
  )
}
