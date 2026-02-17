import { cn } from "@/lib/utils"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed left-0 top-0 z-40 h-full w-[60px] text-white lg:w-[80px]">
        {/* Navigation content */}
      </nav>
      <main className={cn("ml-[60px] lg:ml-[80px]")}>
        {children}
      </main>
    </div>
  )
}

