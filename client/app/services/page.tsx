"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Shield, Zap, Clock, Users, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { GlowingButton } from "@/components/ui/glowing-button"

export default function ServicesPage() {
  const services = [
    {
      icon: <Brain className="h-10 w-10 text-primary" />,
      title: "AI Medical Diagnosis",
      description: "Advanced machine learning algorithms for accurate disease detection in medical images",
      features: [
        "Early detection of diseases",
        "High accuracy rate (98%+)",
        "Support for multiple imaging types",
        "Instant analysis and reporting",
      ],
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Blockchain Medical Records",
      description: "Secure, immutable medical records stored on the blockchain",
      features: [
        "End-to-end encryption",
        "Patient-controlled access",
        "Immutable audit trail",
        "Interoperable with existing systems",
      ],
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Telemedicine Consultations",
      description: "Connect with verified medical professionals for remote consultations",
      features: ["Video and audio calls", "Secure messaging", "Digital prescriptions", "Follow-up scheduling"],
    },
    {
      icon: <Sparkles className="h-10 w-10 text-primary" />,
      title: "Decentralized Payments",
      description: "Transparent and secure payment system for medical services",
      features: [
        "Cryptocurrency payments",
        "Traditional payment methods",
        "Automated billing",
        "Payment escrow for services",
      ],
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Emergency Response",
      description: "Rapid connection to emergency services with medical data sharing",
      features: [
        "One-click emergency alerts",
        "Automatic location sharing",
        "Medical history access for responders",
        "Emergency contact notification",
      ],
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Health Monitoring",
      description: "Continuous health monitoring with blockchain-verified data",
      features: [
        "Integration with wearable devices",
        "Personalized health insights",
        "Anomaly detection",
        "Secure data sharing with providers",
      ],
    },
  ]

  return (
    <div className="container px-4 md:px-6 py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center space-y-4 mb-12 md:mb-20"
      >
        <Badge className="mb-2" variant="outline">
          Our Services
        </Badge>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
          Comprehensive Healthcare Solutions
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Aeternum combines cutting-edge AI technology with blockchain security to revolutionize healthcare delivery
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/10 hover:border-primary/50 group">
              <CardHeader>
                <div className="transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                  {service.icon}
                </div>
                <CardTitle className="transition-colors duration-300 group-hover:text-primary">
                  {service.title}
                </CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex justify-end">
                  <Link
                    href="/learn-more"
                    className="text-sm font-medium text-primary flex items-center hover:underline"
                  >
                    Learn more
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-16 md:mt-24 text-center"
      >
        <div className="rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-8 md:p-12 shadow-lg border border-primary/20 backdrop-blur-sm max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to experience the future of healthcare?</h2>
          <p className="text-muted-foreground mb-6 max-w-[600px] mx-auto">
            Join thousands of patients and healthcare providers who are already benefiting from our platform.
          </p>
          <GlowingButton asChild>
            <Link href="/auth/login">Sign In</Link>
          </GlowingButton>
        </div>
      </motion.div>
    </div>
  )
}

