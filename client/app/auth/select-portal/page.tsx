"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GlowingButton } from "@/components/ui/glowing-button"
import { ArrowRight, Building, User } from "lucide-react"

export default function SelectPortalPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-gradient-to-b from-primary/5 via-background/0 to-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background/0 to-transparent pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-3xl mb-12 z-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
          Welcome to Aeternum Health
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Choose your portal to access our comprehensive healthcare services
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onMouseEnter={() => setHoveredCard("patient")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <Link href="/auth/login" className="block h-full">
            <Card
              className={`h-full border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 ${hoveredCard === "patient" ? "scale-105" : ""}`}
            >
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Patient Portal</h2>
                <p className="text-muted-foreground mb-6">
                  Access your medical records, book appointments, request emergency services, and get AI-powered health
                  analysis
                </p>
                <GlowingButton className="mt-auto">
                  Patient Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </GlowingButton>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onMouseEnter={() => setHoveredCard("hospital")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <Link href="/auth/hospital-login" className="block h-full">
            <Card
              className={`h-full border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 ${hoveredCard === "hospital" ? "scale-105" : ""}`}
            >
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Building className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Hospital Staff Portal</h2>
                <p className="text-muted-foreground mb-6">
                  Manage patient records, schedule appointments, coordinate emergency services, and access hospital
                  administration tools
                </p>
                <GlowingButton className="mt-auto">
                  Hospital Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </GlowingButton>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-12 text-center z-10"
      >
        <p className="text-muted-foreground mb-4">New to Aeternum Health? Learn more about our services</p>
        <Button variant="outline" className="border-primary/20 bg-primary/5 hover:bg-primary/10" asChild>
          <Link href="/learn-more">Learn More</Link>
        </Button>
      </motion.div>
    </div>
  )
}

