"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, userRole, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only run this effect after initial loading is complete
    if (!loading) {
      if (!user) {
        // If no user, redirect to login
        router.push("/auth/login")
      } else if (requiredRole && userRole !== requiredRole) {
        // If role doesn't match, redirect based on actual role
        if (userRole === "hospital") {
          router.push("/admin/dashboard")
        } else if (userRole === "patient") {
          router.push("/patient-dashboard")
        } else {
          router.push("/dashboard")
        }
      }
    }
  }, [user, userRole, loading, router, requiredRole])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!user) {
    return null
  }

  // Don't render if role doesn't match
  if (requiredRole && userRole !== requiredRole) {
    return null
  }

  // Render children if authenticated and role matches (or no role required)
  return <>{children}</>
}

