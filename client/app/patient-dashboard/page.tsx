"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GlowingButton } from "@/components/ui/glowing-button"
import { Activity, Ambulance, Calendar, FileText, HeartPulse, User } from "lucide-react"

export default function PatientDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-2 mb-8"
      >
        <h1 className="text-3xl font-bold">Patient Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.displayName || user?.email?.split("@")[0] || "Patient"}
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Next: Dr. Sharma on May 15</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => router.push("/appointments")}
            >
              View All
            </Button>
          </CardFooter>
        </Card>
        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Last updated: 3 days ago</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => router.push("/dashboard")}
            >
              View Records
            </Button>
          </CardFooter>
        </Card>
        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Health Status</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Good</div>
            <p className="text-xs text-muted-foreground">Last checkup: April 28</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => router.push("/dashboard")}
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950 dark:to-blue-900 dark:border-blue-800 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartPulse className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Health Analysis
              </CardTitle>
              <CardDescription>Get AI-powered analysis of your health data and medical records</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="mb-6 relative w-32 h-32">
                <div className="absolute inset-0 rounded-full bg-blue-200 dark:bg-blue-800 animate-pulse opacity-50"></div>
                <div className="absolute inset-2 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <HeartPulse className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mb-6">
                Our AI can analyze your symptoms and medical history to provide insights about potential health
                conditions.
              </p>
            </CardContent>
            <CardFooter>
              <GlowingButton className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/analysis")}>
                Start Analysis
              </GlowingButton>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 dark:from-red-950 dark:to-red-900 dark:border-red-800 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ambulance className="h-6 w-6 text-red-600 dark:text-red-400" />
                Emergency Services
              </CardTitle>
              <CardDescription>Request emergency medical assistance and ambulance services</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="mb-6 relative w-32 h-32">
                <div className="absolute inset-0 rounded-full bg-red-200 dark:bg-red-800 animate-ping opacity-30"></div>
                <div className="absolute inset-2 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <Ambulance className="h-12 w-12 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mb-6">
                In case of emergency, you can request an ambulance and track its arrival in real-time.
              </p>
            </CardContent>
            <CardFooter>
              <GlowingButton className="w-full bg-red-600 hover:bg-red-700" onClick={() => router.push("/emergency")}>
                Request Emergency
              </GlowingButton>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          variant="outline"
          className="border-primary/20 bg-primary/5 hover:bg-primary/10"
          onClick={() => router.push("/dashboard")}
        >
          <User className="mr-2 h-4 w-4" />
          Go to Full Dashboard
        </Button>
      </div>
    </div>
  )
}

