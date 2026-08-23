'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const signInWithGoogle = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-end',
      padding: '0 28px 60px', background: '#0a0a0a',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 className="serif" style={{
          fontSize: 42, fontWeight: 400, fontStyle: 'italic',
          color: '#f0ece4', margin: '0 0 10px', letterSpacing: '-0.02em',
        }}>Petrichor</h1>
        <p style={{
          fontSize: 13, color: '#7a7672', fontWeight: 300,
          letterSpacing: '0.06em', margin: 0,
        }}>The scent of rain on dry earth.</p>
      </div>

      <button
        onClick={signInWithGoogle}
        disabled={loading}
        style={{
          width: '100%', maxWidth: 320, padding: '16px 24px',
          borderRadius: 16, border: 'none', cursor: loading ? 'wait' : 'pointer',
          background: '#161616',
          boxShadow: '6px 6px 14px #050505, -4px -4px 10px #1a1a1a',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
          color: '#f0ece4', fontSize: 14, fontWeight: 500,
          fontFamily: 'var(--font-sans)', letterSpacing: '0.01em',
          transition: 'box-shadow 0.15s',
        }}
      >
        {loading ? (
          <div style={{
            width: 18, height: 18, borderRadius: '50%',
            border: '2px solid #3d3a37', borderTopColor: '#c8a96e',
            animation: 'spin 0.7s linear infinite',
          }}/>
        ) : (
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 29.9 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
            <path fill="#34A853" d="M6.3 14.7l7 5.1C15 16.2 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.3 2 9.7 7.4 6.3 14.7z"/>
            <path fill="#FBBC05" d="M24 46c5.8 0 10.7-1.9 14.3-5.2l-6.6-5.4C29.8 37 27 38 24 38c-5.9 0-10.9-4-12.7-9.5l-7 5.4C7.5 41.8 15.2 46 24 46z"/>
            <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-.9 2.8-2.9 5.1-5.4 6.6l6.6 5.4C41 36.9 45 31 45 24c0-1.3-.2-2.7-.5-4z"/>
          </svg>
        )}
        {loading ? 'Signing in…' : 'Continue with Google'}
      </button>

      <p style={{
        marginTop: 20, fontSize: 11, color: '#3d3a37',
        textAlign: 'center', fontWeight: 300, letterSpacing: '0.04em',
      }}>Your data stays private. No ads, ever.</p>
    </div>
  )
}
