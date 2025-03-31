"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  value: string
  label: string
}

export function StatsCard({ value, label }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            {value}
          </p>
          <p className="text-sm text-muted-foreground mt-1">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

