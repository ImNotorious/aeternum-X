"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWeb3 } from "@/hooks/use-web3"
import { ArrowRight, Brain, Shield, Zap, Clock, Users, Sparkles, ChevronDown } from "lucide-react"
import HeroAnimation from "@/components/hero-animation"
import { ParticlesContainer } from "@/components/particles-container"
import { GlowingButton } from "@/components/ui/glowing-button"
import { FeatureCard } from "@/components/feature-card"
import { TestimonialCard } from "@/components/testimonial-card"
import { StatsCard } from "@/components/stats-card"
import { FloatingIcons } from "@/components/floating-icons"

export default function Home() {
  const { theme } = useTheme()
  const { account, connectWallet } = useWeb3()
  const [mounted, setMounted] = useState(false)
  const featuresRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <ParticlesContainer />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background/0 to-background pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background/0 to-transparent pointer-events-none"></div>

        <div className="container relative z-10 px-4 md:px-6 py-10 md:py-20">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col justify-center space-y-4"
            >
              <div className="space-y-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Badge
                    className="mb-2 px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20"
                    variant="outline"
                  >
                    AI-ML Powered
                  </Badge>
                </motion.div>
                <motion.h1
                  className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text "
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  Revolutionising Medical Diagnosis
                </motion.h1>
                <motion.p
                  className="max-w-[600px] text-muted-foreground md:text-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  Using Machine Learning for Early Disease Detection in Medical Images
                </motion.p>
              </div>
              <motion.div
                className="flex flex-col sm:flex-row gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <GlowingButton asChild>
                  <Link href="/auth/select-portal" className="flex items-center">
                    Sign In
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </GlowingButton>
                <Button variant="outline" className="border-primary/20 bg-primary/5 hover:bg-primary/10" asChild>
                  <Link href="/learn-more">Learn More</Link>
                </Button>
              </motion.div>
              {/* {!account && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                >
                  <Button
                    onClick={connectWallet}
                    variant="ghost"
                    className="mt-2 border border-primary/20 bg-primary/5 hover:bg-primary/10"
                  >
                    Connect Wallet
                  </Button>
                </motion.div>
              )} */}
              {account && (
                <motion.p
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                >
                  Connected: {account.slice(0, 6)}...{account.slice(-4)}
                </motion.p>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center lg:justify-end"
            >
              <div className="relative h-[350px] w-[350px] md:h-[450px] md:w-[450px]">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-full blur-3xl opacity-30"></div>
                <HeroAnimation />
              </div>
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            onClick={scrollToFeatures}
            style={{ opacity }}
          >
            <ChevronDown className="h-8 w-8 text-primary/60" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 relative overflow-hidden border-t border-primary/10 bg-gradient-to-b from-background to-background/95">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <StatsCard value="98%" label="Accuracy Rate" />
            <StatsCard value="24/7" label="Availability" />
            <StatsCard value="10k+" label="Patients Served" />
            <StatsCard value="500+" label="Verified Doctors" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background/0 to-transparent pointer-events-none"></div>
        <FloatingIcons />

        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          >
            <Badge className="mb-2" variant="outline">
              Revolutionary Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primaryvia-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary to-primary-foreground">
              Why Choose Aeternum?
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              Aeternum enables early detection with high accuracy and fast results, preventing health risks before they
              become critical.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={<Brain className="h-10 w-10 text-primary" />}
              title="AI Diagnosis"
              description="Advanced machine learning algorithms for accurate disease detection"
              delay={0.1}
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-primary" />}
              title="Blockchain Security"
              description="Immutable medical records secured by blockchain technology"
              delay={0.2}
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-primary" />}
              title="Fast Results"
              description="Get diagnosis results in minutes, not days"
              delay={0.3}
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-primary" />}
              title="24/7 Availability"
              description="Access medical services anytime, anywhere"
              delay={0.4}
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Expert Network"
              description="Connect with verified medical professionals"
              delay={0.5}
            />
            <FeatureCard
              icon={<Sparkles className="h-10 w-10 text-primary" />}
              title="Decentralized Payments"
              description="Secure and transparent payment system"
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Rest of the component remains the same */}
      {/* How It Works Section */}
      <section className="py-20 md:py-32 relative overflow-hidden border-t border-primary/10 bg-gradient-to-b from-background/95 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-background/0 to-transparent pointer-events-none"></div>

        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
          >
            <Badge className="mb-2" variant="outline">
              Simple Process
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primaryvia-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary to-primary-foreground">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              Our machine-learning medical platform connects patients with doctors securely and efficiently
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 transform -translate-y-1/2 z-0"></div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative z-10"
            >
              <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20 mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Connect Wallet</h3>
                  <p className="text-muted-foreground">
                    Link your MetaMask or other Web3 wallet to access the platform
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative z-10"
            >
              <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20 mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Book Consultation</h3>
                  <p className="text-muted-foreground">
                    Schedule a consultation with a verified doctor using smart contracts
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="relative z-10"
            >
              <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20 mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
                  <p className="text-muted-foreground">
                    Pay securely using cryptocurrency or traditional payment methods
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 relative overflow-hidden border-t border-primary/10">
        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
          >
            <Badge className="mb-2" variant="outline">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primaryvia-primary via-primary via-primary via-primary via-primary via-primary via-primary via-primary to-primary-foreground">
              What Our Users Say
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              Hear from patients and doctors who have experienced the Aeternum difference
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <TestimonialCard
              quote="Aeternum's AI diagnosis helped detect my condition early, potentially saving my life."
              author="Sarah Johnson"
              role="Patient"
              avatar="/placeholder.svg?height=80&width=80"
              delay={0.1}
            />
            <TestimonialCard
              quote="As a doctor, the blockchain security gives me confidence that patient records are secure and immutable."
              author="Dr. Michael Chen"
              role="Cardiologist"
              avatar="/placeholder.svg?height=80&width=80"
              delay={0.3}
            />
            <TestimonialCard
              quote="The platform's ease of use and quick results have transformed how I manage my healthcare."
              author="David Wilson"
              role="Patient"
              avatar="/placeholder.svg?height=80&width=80"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden border-t border-primary/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background/0 to-transparent pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center justify-center space-y-4 text-center"
        >
          <div className="rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-8 md:p-12 shadow-lg border border-primary/20 backdrop-blur-sm max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text ">
              Ready to Transform Healthcare?
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              Join our platform today and experience the future of medical diagnosis and consultation
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <GlowingButton asChild>
                <Link href="/auth/select-portal" className="flex items-center">
                  Sign In
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </GlowingButton>
              <Button variant="outline" className="border-primary/20 bg-primary/5 hover:bg-primary/10" asChild>
                <Link href="/about" className="flex items-center">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

