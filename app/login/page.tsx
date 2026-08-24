'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { T, E } from '@/lib/constants'

const LENGTH = 6

export default function LoginPage() {
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(''))
  const [error, setError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  useEffect(() => { inputs.current[0]?.focus() }, [])

  const submit = async (pin: string) => {
    setSubmitting(true)
    setError(false)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })
    if (res.ok) {
      router.push('/today')
      router.refresh()
    } else {
      setError(true)
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
    setError(false)
    if (d && i < LENGTH - 1) inputs.current[i + 1]?.focus()
    if (next.every(x => x !== '') && next.length === LENGTH) submit(next.join(''))
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputs.current[i - 1]?.focus()
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: T.bg, padding: 24 }}>
      <div className="serif" style={{ fontSize: 26, color: T.fg, marginBottom: 6, fontStyle: 'italic' }}>Petrichor</div>
      <div style={{ fontSize: 12, color: T.fgDim, marginBottom: 32 }}>Enter your PIN</div>

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

      {error && <div style={{ fontSize: 12, color: '#c47c7c' }}>Incorrect PIN — try again</div>}
    </div>
  )
}
