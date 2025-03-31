import type React from "react"
import ProtectedRoute from "@/components/protected-route"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute requiredRole="hospital">{children}</ProtectedRoute>
}

