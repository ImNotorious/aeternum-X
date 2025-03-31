"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GlowingButton } from "@/components/ui/glowing-button"
import { Logo } from "@/components/logo"
import { Mail, Lock, AlertCircle, Brain, Shield, Zap, Clock, Users, Sparkles } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [windowHeight, setWindowHeight] = useState(800) // Default fallback height

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      setWindowHeight(window.innerHeight)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await signIn(email, password)
      setShowSuccessAnimation(true)
      setTimeout(() => {
        router.push("/patient-dashboard")
      }, 1500)
    } catch (error: any) {
      setError(error.message || "Failed to sign in")
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      await signUp(email, password)
      setShowSuccessAnimation(true)
      setTimeout(() => {
        router.push("/auth/signup-success")
      }, 1500)
    } catch (error: any) {
      setError(error.message || "Failed to sign up")
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setLoading(true)

    try {
      await signInWithGoogle()
      setShowSuccessAnimation(true)
      setTimeout(() => {
        router.push("/patient-dashboard")
      }, 1500)
    } catch (error: any) {
      setError(error.message || "Failed to sign in with Google")
      setLoading(false)
    }
  }

  // Floating icons animation
  const icons = [
    { icon: <Brain className="h-8 w-8 text-primary/30" />, delay: 0 },
    { icon: <Shield className="h-8 w-8 text-primary/30" />, delay: 1.5 },
    { icon: <Zap className="h-8 w-8 text-primary/30" />, delay: 0.8 },
    { icon: <Clock className="h-8 w-8 text-primary/30" />, delay: 2.2 },
    { icon: <Users className="h-8 w-8 text-primary/30" />, delay: 1.2 },
    { icon: <Sparkles className="h-8 w-8 text-primary/30" />, delay: 0.5 },
  ]

  if (!mounted) {
    return null // Return null on server-side to prevent hydration errors
  }

  if (showSuccessAnimation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-primary/5 via-background/0 to-background">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20 blur-3xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1.5 }}
            transition={{ duration: 1.5 }}
          />
          <motion.div
            className="relative flex flex-col items-center justify-center"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-primary text-9xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", stiffness: 100, duration: 1 }}
            >
              ✓
            </motion.div>
            <motion.h2
              className="mt-6 text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Authentication Successful!
            </motion.h2>
            <motion.p
              className="mt-2 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {activeTab === "signup" ? "Redirecting to welcome page..." : "Redirecting to dashboard..."}
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-primary/5 via-background/0 to-background overflow-hidden">
      {/* Floating icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {icons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute"
            initial={{ x: Math.random() * 100 - 50, y: -50, opacity: 0 }}
            animate={{
              x: [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
              y: [Math.random() * windowHeight, Math.random() * windowHeight, Math.random() * windowHeight],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 15,
              times: [0, 0.5, 1],
              repeat: Number.POSITIVE_INFINITY,
              delay: item.delay,
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      {/* Glowing background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background/0 to-transparent pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          className="flex justify-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Logo />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm shadow-xl">
            <CardHeader className="space-y-1">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
                  Patient Portal
                </CardTitle>
                <CardDescription className="text-center">Sign in to access your healthcare services</CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-6 bg-primary/10 p-1">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <motion.div
                      className="space-y-2"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="patient@example.com"
                          className="pl-10 border-primary/20 bg-primary/5 focus-visible:ring-primary"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </motion.div>
                    <motion.div
                      className="space-y-2"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          className="pl-10 border-primary/20 bg-primary/5 focus-visible:ring-primary"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <GlowingButton type="submit" className="w-full" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                      </GlowingButton>
                    </motion.div>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <motion.div
                      className="space-y-2"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="patient@example.com"
                          className="pl-10 border-primary/20 bg-primary/5 focus-visible:ring-primary"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </motion.div>
                    <motion.div
                      className="space-y-2"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          className="pl-10 border-primary/20 bg-primary/5 focus-visible:ring-primary"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </motion.div>
                    <motion.div
                      className="space-y-2"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type="password"
                          className="pl-10 border-primary/20 bg-primary/5 focus-visible:ring-primary"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <GlowingButton type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating account..." : "Create Patient Account"}
                      </GlowingButton>
                    </motion.div>
                  </form>
                </TabsContent>

                <motion.div
                  className="relative my-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-primary/10"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 gap-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Button
                    variant="outline"
                    className="border-primary/20 bg-primary/5 hover:bg-primary/10"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Google
                  </Button>
                </motion.div>
              </Tabs>

              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <p className="text-sm text-muted-foreground">
                  Are you hospital staff?{" "}
                  <Link href="/auth/hospital-login" className="text-primary hover:underline">
                    Hospital Login
                  </Link>
                </p>
              </motion.div>
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-2">
              <motion.p
                className="text-xs text-muted-foreground text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                By continuing, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </motion.p>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

