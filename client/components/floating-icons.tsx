"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Brain, Shield, Zap, Clock, Users, Sparkles } from "lucide-react"

export function FloatingIcons() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const icons = [
    { icon: <Brain className="h-8 w-8 text-primary/30" />, x: "10%", y: "20%" },
    { icon: <Shield className="h-8 w-8 text-primary/30" />, x: "80%", y: "15%" },
    { icon: <Zap className="h-8 w-8 text-primary/30" />, x: "25%", y: "85%" },
    { icon: <Clock className="h-8 w-8 text-primary/30" />, x: "70%", y: "75%" },
    { icon: <Users className="h-8 w-8 text-primary/30" />, x: "40%", y: "30%" },
    { icon: <Sparkles className="h-8 w-8 text-primary/30" />, x: "60%", y: "60%" },
  ]

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ left: item.x, top: item.y }}
          animate={{
            y: [0, 15, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: index * 0.5,
          }}
        >
          {item.icon}
        </motion.div>
      ))}
    </div>
  )
}

