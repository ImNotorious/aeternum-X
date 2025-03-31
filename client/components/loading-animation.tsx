"use client"

import { motion } from "framer-motion"

export function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-24 h-24">
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-transparent border-t-primary/70"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border-4 border-transparent border-t-primary/50"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)" }}
          animate={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)" }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        />
      </div>
      <motion.p
        className="mt-6 text-primary font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        Processing Analysis
      </motion.p>
    </div>
  )
}

