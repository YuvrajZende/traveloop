import { TopNav } from '@/components/top-nav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopNav />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
