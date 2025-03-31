"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GlowingButton } from "@/components/ui/glowing-button"
import { CheckCircle, ArrowRight } from "lucide-react"

export default function SignupSuccessPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/analysis")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  if (!mounted) return null

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-primary/5 via-background/0 to-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background/0 to-transparent pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", stiffness: 100, duration: 1 }}
              className="mx-auto"
            >
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            </motion.div>
            <CardTitle className="text-2xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
              Account Created Successfully!
            </CardTitle>
            <CardDescription>Welcome to Aeternum - your healthcare revolution begins now</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-muted-foreground">
              Your account has been created successfully. You can now access all the features of our platform.
            </p>

            <div className="flex flex-col gap-4">
              <GlowingButton asChild>
                <Link href="/analysis" className="flex items-center justify-center">
                  Go to Analysis Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </GlowingButton>

              <p className="text-sm text-muted-foreground">
                Redirecting in <span className="font-bold text-primary">{countdown}</span> seconds...
              </p>
            </div>

            <div className="text-sm text-muted-foreground pt-4 border-t border-primary/10">
              <p>
                Need help getting started? Check out our{" "}
                <Link href="/learn-more" className="text-primary hover:underline">
                  guide
                </Link>{" "}
                or{" "}
                <Link href="/doctors" className="text-primary hover:underline">
                  connect with a doctor
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

