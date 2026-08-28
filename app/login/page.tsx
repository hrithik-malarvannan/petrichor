'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { T, E } from '@/lib/constants'
import { browserSupportsWebAuthn, startAuthentication } from '@simplewebauthn/browser'

const LENGTH = 6

export default function LoginPage() {
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(''))
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [webauthnAvailable, setWebauthnAvailable] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  useEffect(() => {
    inputs.current[0]?.focus()
    setWebauthnAvailable(browserSupportsWebAuthn())
  }, [])

  const goIn = () => {
    router.push('/today')
    router.refresh()
  }

  const tryWebauthn = async () => {
    setError(null)
    try {
      const optionsRes = await fetch('/api/auth/webauthn/login-options', { method: 'POST' })
      if (!optionsRes.ok) {
        const { error: msg } = await optionsRes.json().catch(() => ({ error: null }))
        setError(msg || 'Fingerprint/Face ID isn\u2019t set up yet — use your PIN')
        return
      }
      const optionsJSON = await optionsRes.json()
      const assertion = await startAuthentication({ optionsJSON })

      const verifyRes = await fetch('/api/auth/webauthn/login-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assertion),
      })
      if (verifyRes.ok) goIn()
      else setError('Verification failed — try your PIN')
    } catch {
      // User cancelled the prompt, or device doesn't support it — silently fall back to PIN
    }
  }

  const submitPin = async (pin: string) => {
    setSubmitting(true)
    setError(null)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })
    if (res.ok) {
      goIn()
    } else {
      setError('Incorrect PIN — try again')
      setDigits(Array(LENGTH).fill(''))
      inputs.current[0]?.focus()
      setSubmitting(false)
    }
  }

  const handleChange = (i: number, val: string) => {
    const d = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = d
    setDigits(next)
    setError(null)
    if (d && i < LENGTH - 1) inputs.current[i + 1]?.focus()
    if (next.every(x => x !== '') && next.length === LENGTH) submitPin(next.join(''))
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputs.current[i - 1]?.focus()
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: T.bg, padding: 24 }}>
      <div className="serif" style={{ fontSize: 26, color: T.fg, marginBottom: 6, fontStyle: 'italic' }}>Petrichor</div>
      <div style={{ fontSize: 12, color: T.fgDim, marginBottom: 28 }}>Enter your PIN</div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => { inputs.current[i] = el }}
            value={d}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            disabled={submitting}
            inputMode="numeric"
            maxLength={1}
            style={{
              width: 42, height: 52, textAlign: 'center', fontSize: 22, fontFamily: 'inherit',
              color: T.fg, background: T.sunken, border: 'none', borderRadius: 12,
              boxShadow: error ? '0 0 0 1.5px #c47c7c66' : T.shadowIn,
              outline: 'none', transition: `box-shadow .15s ${E}`,
            }}
          />
        ))}
      </div>

      {error && <div style={{ fontSize: 12, color: '#c47c7c', marginBottom: 16, textAlign: 'center', maxWidth: 260 }}>{error}</div>}

      {webauthnAvailable && (
        <button onClick={tryWebauthn} style={{
          marginTop: 12, display: 'flex', alignItems: 'center', gap: 8,
          background: T.surface, boxShadow: T.shadowBtn, border: 'none', borderRadius: 12,
          padding: '10px 18px', color: T.fgMuted, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 2a5 5 0 00-5 5v1M10 2a5 5 0 015 5v1M4 12v1a6 6 0 0012 0v-1M7 9v3a3 3 0 006 0V9M10 9v6" strokeLinecap="round"/>
          </svg>
          Use fingerprint / Face ID
        </button>
      )}
    </div>
  )
}
