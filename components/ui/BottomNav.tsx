'use client'
import { usePathname, useRouter } from 'next/navigation'

const T = {
  surface: '#111111', border: '#1e1e1e', fg: '#f0ece4',
  fgDim: '#3d3a37', accent: '#c8a96e',
  shadowOut: '6px 6px 14px #050505, -4px -4px 10px #1a1a1a',
}

const TABS = [
  { id: 'today',    label: 'Today',    href: '/today',
    Icon: ({c}: {c:string}) => <svg width="20" height="20" viewBox="0 0 20 20" fill={c}><path d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"/></svg> },
  { id: 'tasks',    label: 'Tasks',    href: '/tasks',
    Icon: ({c}: {c:string}) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="3" stroke={c} strokeWidth="1.4"/><path d="M7 7h6M7 10h6M7 13h4" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></svg> },
  { id: 'progress', label: 'Progress', href: '/progress',
    Icon: ({c}: {c:string}) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="12" width="3" height="6" rx="1" fill={c}/><rect x="7" y="8" width="3" height="10" rx="1" fill={c}/><rect x="12" y="4" width="3" height="14" rx="1" fill={c}/></svg> },
  { id: 'reports',  label: 'Reports',  href: '/reports',
    Icon: ({c}: {c:string}) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M9 4H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4" stroke={c} strokeWidth="1.4" strokeLinecap="round"/><path d="M15 2l3 3-7 7-4 1 1-4 7-7z" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id: 'settings', label: 'Settings', href: '/settings',
    Icon: ({c}: {c:string}) => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l.991 1.716a1 1 0 00.86.534l1.985.05c1.346.033 2.033 1.582 1.16 2.609l-1.31 1.55a1 1 0 000 1.292l1.31 1.55c.873 1.027.186 2.576-1.16 2.609l-1.985.05a1 1 0 00-.86.534l-.99 1.716c-.674 1.167-2.358 1.167-3.031 0l-.99-1.716a1 1 0 00-.86-.534l-1.985-.05c-1.346-.033-2.033-1.582-1.16-2.609l1.31-1.55a1 1 0 000-1.292l-1.31-1.55c-.873-1.027-.186-2.576 1.16-2.609l1.985-.05a1 1 0 00.86-.534l.99-1.716z" stroke={c} strokeWidth="1.4"/><circle cx="10" cy="10" r="2.5" stroke={c} strokeWidth="1.4"/></svg> },
]

export default function BottomNav() {
  const pathname = usePathname()
  const router   = useRouter()
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: T.surface, boxShadow: `0 -4px 24px rgba(0,0,0,0.6), ${T.shadowOut}`,
      borderTop: `1px solid ${T.border}`,
      padding: '10px 8px 20px', display: 'flex', zIndex: 10,
    }}>
      {TABS.map(({ id, label, href, Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        const c = active ? T.accent : T.fgDim
        return (
          <button key={id} onClick={() => router.push(href)} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 3, background: 'none', border: 'none',
            cursor: 'pointer', padding: '4px 0', fontFamily: 'var(--font-sans)',
          }}>
            <Icon c={c}/>
            <span style={{ fontSize: 9, fontWeight: active ? 600 : 400,
              letterSpacing: '0.04em', color: c, textTransform: 'uppercase' }}>{label}</span>
            {active && <div style={{ width: 4, height: 4, borderRadius: '50%',
              background: T.accent, boxShadow: `0 0 6px ${T.accent}88` }}/>}
          </button>
        )
      })}
    </nav>
  )
}
