'use client'
import { useState } from 'react'

const T = {
  surface: '#111111', raised: '#161616',
  shadowOut:   '6px 6px 14px #050505, -4px -4px 10px #1a1a1a',
  shadowIn:    'inset 3px 3px 8px #050505, inset -3px -3px 8px #1a1a1a',
  shadowSm:    '3px 3px 8px #050505, -2px -2px 6px #191919',
  shadowBtn:   '4px 4px 10px #050505, -3px -3px 8px #1c1c1c',
  shadowBtnPr: 'inset 2px 2px 6px #050505, inset -2px -2px 6px #1a1a1a',
  accent: '#c8a96e', border: '#1e1e1e', fg: '#f0ece4', fgDim: '#3d3a37',
}

interface NeuProps {
  children: React.ReactNode
  style?: React.CSSProperties
  onClick?: () => void
  pressed?: boolean
  inset?: boolean
  className?: string
}

export function Neu({ children, style, onClick, pressed, inset, className }: NeuProps) {
  return (
    <div onClick={onClick} className={className} style={{
      background: T.surface, borderRadius: 16,
      boxShadow: inset ? T.shadowIn : pressed ? T.shadowBtnPr : T.shadowOut,
      transition: `box-shadow 0.15s`,
      ...style,
    }}>{children}</div>
  )
}

interface NeuBtnProps {
  children: React.ReactNode
  onClick?: () => void
  style?: React.CSSProperties
  accent?: boolean
  small?: boolean
  disabled?: boolean
}

export function NeuBtn({ children, onClick, style, accent, small, disabled }: NeuBtnProps) {
  const [pr, setPr] = useState(false)
  return (
    <button
      onPointerDown={() => setPr(true)}
      onPointerUp={() => setPr(false)}
      onPointerLeave={() => setPr(false)}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: accent ? T.accent : T.surface,
        color: accent ? '#0a0a0a' : T.fg,
        border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-sans)',
        borderRadius: small ? 10 : 14,
        padding: small ? '8px 16px' : '13px 24px',
        fontSize: small ? 12 : 14, fontWeight: 600, letterSpacing: '0.04em',
        boxShadow: pr ? T.shadowBtnPr : T.shadowBtn,
        transition: `box-shadow 0.12s, transform 0.1s`,
        transform: pr ? 'scale(0.97)' : 'scale(1)',
        opacity: disabled ? 0.4 : 1,
        ...style,
      }}>{children}</button>
  )
}

export function NeuToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div onClick={onToggle} style={{
      width: 48, height: 26, borderRadius: 13, cursor: 'pointer',
      background: T.surface, boxShadow: T.shadowIn,
      display: 'flex', alignItems: 'center', padding: '0 3px',
      flexShrink: 0,
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        background: on ? T.accent : T.raised,
        boxShadow: on ? `0 0 8px ${T.accent}66` : T.shadowSm,
        transform: on ? 'translateX(22px)' : 'translateX(0)',
        transition: `transform 0.2s, background 0.2s`,
      }}/>
    </div>
  )
}

export function Ring({
  pct, size = 52, stroke = 3, color = T.accent, done
}: {
  pct: number; size?: number; stroke?: number; color?: string; done?: boolean
}) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.border} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={done ? '#7ca885' : color}
        strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct / 100)}
        style={{ transition: `stroke-dashoffset 0.7s, stroke 0.3s` }}/>
    </svg>
  )
}

export function Skeleton({ width = '100%', height = 20, radius = 8 }: {
  width?: string | number; height?: number; radius?: number
}) {
  return (
    <div className="skeleton" style={{
      width, height, borderRadius: radius, flexShrink: 0,
    }}/>
  )
}
