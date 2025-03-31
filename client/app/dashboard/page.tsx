"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useWeb3 } from "@/hooks/use-web3"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardAppointments from "@/components/dashboard/appointments"
import DashboardPayments from "@/components/dashboard/payments"
import DashboardMedicalRecords from "@/components/dashboard/medical-records"
import { GlowingButton } from "@/components/ui/glowing-button"

export default function DashboardPage() {
  const router = useRouter()
  const { account, connectWallet } = useWeb3()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConnect = async () => {
    await connectWallet()
    router.push("/analysis/")
  }

  if (!mounted) return null

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Proceed to Dashboard</CardTitle>
              <CardDescription>
                Continue to the main panel for access and control over your settings and data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GlowingButton onClick={handleConnect} className="w-full">
                Proceed to Dashboard
              </GlowingButton>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <motion.h2
            className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Dashboard
          </motion.h2>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Tabs defaultValue="appointments" className="space-y-4">
            <TabsList className="bg-primary/10 p-1">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
            </TabsList>
            <TabsContent value="appointments">
              <DashboardAppointments />
            </TabsContent>
            <TabsContent value="payments">
              <DashboardPayments />
            </TabsContent>
            <TabsContent value="medical-records">
              <DashboardMedicalRecords />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

