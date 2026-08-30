import BottomNav from '@/components/ui/BottomNav'
import { HabitsProvider } from '@/hooks/useHabits'
import { LogsProvider } from '@/hooks/useLogs'
import { TodosProvider } from '@/hooks/useTodos'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <HabitsProvider>
      <LogsProvider>
        <TodosProvider>
          <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100vh',
            background: '#0a0a0a', position: 'relative' }}>
            <main style={{ paddingBottom: 80 }}>{children}</main>
            <BottomNav/>
          </div>
        </TodosProvider>
      </LogsProvider>
    </HabitsProvider>
  )
}
