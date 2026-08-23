'use client'
import { useState } from 'react'
import { T } from '@/lib/constants'
import { NeuBtn, NeuToggle } from '@/components/ui/Neu'

const KEYS = ['petrichor-habits', 'petrichor-logs', 'petrichor-summaries', 'petrichor-todos']

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${T.border}` }}>
      <span style={{ fontSize: 13, color: T.fg }}>{label}</span>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const [reminders, setReminders] = useState(true)
  const [confirmClear, setConfirmClear] = useState(false)

  const handleExport = () => {
    const data: Record<string, unknown> = {}
    KEYS.forEach(k => {
      const raw = window.localStorage.getItem(k)
      if (raw) data[k] = JSON.parse(raw)
    })
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `petrichor-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    if (!confirmClear) { setConfirmClear(true); return }
    KEYS.forEach(k => window.localStorage.removeItem(k))
    setConfirmClear(false)
    window.location.reload()
  }

  return (
    <div style={{ padding: '32px 20px 120px', minHeight: '100vh', background: T.bg }}>
      <h1 className="serif" style={{ fontSize: 28, fontWeight: 400, fontStyle: 'italic', color: T.fg, margin: '0 0 24px', letterSpacing: '-0.02em' }}>Settings</h1>

      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', color: T.fgDim, textTransform: 'uppercase', marginBottom: 6 }}>Notifications</div>
      <div style={{ marginBottom: 24 }}>
        <Row label="Daily reminders">
          <NeuToggle on={reminders} onToggle={() => setReminders(v => !v)} />
        </Row>
      </div>

      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', color: T.fgDim, textTransform: 'uppercase', marginBottom: 10 }}>Data</div>
      <div style={{ marginBottom: 10 }}>
        <NeuBtn onClick={handleExport} style={{ width: '100%', marginBottom: 10 }}>Export data (JSON)</NeuBtn>
        <NeuBtn onClick={handleClear} style={{ width: '100%', color: confirmClear ? '#c47c7c' : undefined }}>
          {confirmClear ? 'Tap again to confirm — this cannot be undone' : 'Clear all data'}
        </NeuBtn>
      </div>

      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', color: T.fgDim, textTransform: 'uppercase', marginTop: 24, marginBottom: 10 }}>About</div>
      <div style={{ fontSize: 12, color: T.fgDim, lineHeight: 1.7 }}>
        Petrichor · personal use only · all data stored locally on this device via localStorage. Nothing is sent to a server.
      </div>
    </div>
  )
}
