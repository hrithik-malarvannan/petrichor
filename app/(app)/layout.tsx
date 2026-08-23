import BottomNav from '@/components/ui/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100vh',
      background: '#0a0a0a', position: 'relative' }}>
      <main style={{ paddingBottom: 80 }}>{children}</main>
      <BottomNav/>
    </div>
  )
}
