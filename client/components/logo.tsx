import Link from "next/link"
import { Activity } from "lucide-react"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative">
        <div className="absolute -inset-1 rounded-full blur-md bg-primary/30"></div>
        <Activity className="h-6 w-6 text-primary relative" />
      </div>
      <span
        className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primaryvia-primaryvia-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary
      via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary
      via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary to-primary-foreground"
      >
        Aeternum
      </span>
    </Link>
  )
}

