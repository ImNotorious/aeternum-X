"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  delay?: number
}

export function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/10 hover:border-primary/50 group">
        <CardHeader>
          <div className="transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
            {icon}
          </div>
          <CardTitle className="transition-colors duration-300 group-hover:text-primary">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {title === "AI Diagnosis" &&
              "Our AI models are trained on millions of medical images to provide highly accurate diagnoses."}
            {title === "Blockchain Security" &&
              "Patient data is encrypted and stored on the blockchain, ensuring privacy and security."}
            {title === "Fast Results" &&
              "Our system processes medical images instantly, providing quick and reliable results."}
            {title === "24/7 Availability" &&
              "Our platform is available round the clock, ensuring you get medical attention when needed."}
            {title === "Expert Network" &&
              "Our platform connects you with qualified doctors for consultations and second opinions."}
            {title === "Decentralized Payments" &&
              "Pay for services using cryptocurrency or traditional payment methods with full transparency."}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

