import type React from "react"
import ProtectedRoute from "@/components/protected-route"

export default function AdminEmergencyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute requiredRole="hospital">{children}</ProtectedRoute>
}

