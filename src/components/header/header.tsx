import { Bell, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="flex flex-col items-start justify-between border-b bg-white px-4 py-4 sm:flex-row sm:items-center sm:px-6">
      <div className="mb-4 sm:mb-0">
        <h1 className="text-xl text-blue-600">{title}</h1>
        <h2 className="text-2xl font-bold text-blue-600">{subtitle}</h2>
      </div>
      <div className="flex w-full flex-col items-start gap-4 sm:w-auto sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
          <Input className="w-full pl-8 sm:w-auto" placeholder="Search..." />
        </div>
        <div className="relative">
          <Bell className="h-6 w-6 text-gray-600" />
          <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500 p-0 text-center text-xs text-white">
            3
          </Badge>
        </div>
        <Button className="h-10 w-10 rounded-full bg-cover bg-center p-0" style={{ backgroundImage: "url('/placeholder.svg')" }} />
      </div>
    </header>
  )
}

