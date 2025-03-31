"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { GlowingButton } from "@/components/ui/glowing-button"
import Link from "next/link"
import { ArrowRight, Brain, Shield, Zap, Clock, Siren, Hospital } from "lucide-react"

export default function LearnMorePage() {
  const technologies = [
    {
      icon: <Brain className="h-10 w-10 text-primary" />,
      title: "Artificial Intelligence",
      description:
        "Our AI models are trained on millions of medical images to provide highly accurate diagnoses. We use deep learning techniques to identify patterns that might be missed by human eyes.",
    },
    {


      icon: <Siren className="h-10 w-10 text-primary" />,
      title: "Ambulance Management",
      description:
        "Our system optimizes ambulance dispatch, ensuring faster response times by integrating real-time location tracking and automated emergency routing.",
    },

    {
      icon: <Hospital className="h-10 w-10 text-primary" />,
      title: "Hospital Management",
      description:
        "A streamlined platform for hospital administration, handling patient records, appointment scheduling, and resource allocation for efficient healthcare management.",
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Real-time Processing",
      description:
        "Our platform processes medical images and data in real-time, providing instant feedback and reducing wait times for diagnoses.",
    },
  ]

  const faqs = [
    {
      question: "How accurate is the AI diagnosis?",
      answer:
        "Our AI diagnostic system has achieved an accuracy rate of over 98% in clinical trials, often detecting conditions earlier than traditional methods. However, we always recommend consulting with a healthcare professional for final diagnoses.",
    },
    {
      question: "How do I connect with doctors on the platform?",
      answer:
        "After creating an account, you can browse our network of verified healthcare providers, filter by specialty, and book consultations directly through the platform.",
    },
    {
      question: "Is the platform available worldwide?",
      answer:
        "Yes, our platform is available globally. However, some features may vary by region due to different healthcare regulations and available providers.",
    },
    {
      question: "How do I get started?",
      answer:
        "Simply create an account, connect your wallet if you plan to use cryptocurrency, and you'll have immediate access to our AI diagnostic tools and doctor network.",
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
          Learn More
        </Badge>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
          Discover Aeternum
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Explore how our platform is revolutionizing healthcare through AI
        </p>
      </motion.div>

      <Tabs defaultValue="technology" className="mb-16">
        <TabsList className="bg-primary/10 p-1 mx-auto">
          <TabsTrigger
            value="technology"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Technology
          </TabsTrigger>
          <TabsTrigger
            value="benefits"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Benefits
          </TabsTrigger>
          <TabsTrigger
            value="faq"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            FAQ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="technology" className="mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">Cutting-Edge Technology</h2>
              <p className="text-muted-foreground">
                At Aeternum, we leverage the most advanced technologies to create a secure, efficient, and accurate
                healthcare platform. Our unique combination of artificial intelligence creates a system
                that's greater than the sum of its parts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {technologies.map((tech, index) => (
                <motion.div
                  key={tech.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/10 hover:border-primary/50">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          {tech.icon}
                        </div>
                        <CardTitle>{tech.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{tech.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

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
                        <h3 className="text-xl font-bold mb-2">AI Prediction</h3>
                        <p className="text-muted-foreground">
                          Access advanced AI diagnostics for early detection of chest and heart conditions
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
                          Schedule a consultation with a verified medical professional
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
                        <h3 className="text-xl font-bold mb-2">Emergency Response</h3>
                        <p className="text-muted-foreground">
                          Request urgent medical assistance with real-time ambulance tracking and estimated arrival updates
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </section>
          </motion.div>
        </TabsContent>

        <TabsContent value="benefits" className="mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">Key Benefits</h2>
              <p className="text-muted-foreground">
                Our platform offers numerous advantages for patients, healthcare providers, and the healthcare system as
                a whole.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>For Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Early disease detection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Complete control over medical data</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Access to specialists worldwide</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Reduced healthcare costs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Convenient telemedicine options</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Transparent pricing</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>For Healthcare Providers</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>AI-assisted diagnosis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Secure access to patient history</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Reduced administrative burden</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Expanded patient reach</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Streamlined payment process</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Collaboration opportunities</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>For Healthcare Systems</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Reduced diagnostic errors</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Lower overall costs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Improved data interoperability</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Enhanced security and compliance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Better resource allocation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Improved patient outcomes</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 max-w-3xl mx-auto text-center">
              <h3 className="text-xl font-bold mb-4">Real-World Impact</h3>
              <p className="text-muted-foreground mb-6">
                Our platform has already made a significant difference in healthcare outcomes:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">94%</div>
                  <p className="text-sm text-muted-foreground">
                    Earlier detection of conditions compared to traditional methods
                  </p>
                </div>
                <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">68%</div>
                  <p className="text-sm text-muted-foreground">Reduction in diagnostic costs for patients</p>
                </div>
                <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">3.5x</div>
                  <p className="text-sm text-muted-foreground">Increase in specialist access for rural patients</p>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="faq" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </TabsContent>
      </Tabs>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center"
      >
        <div className="rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-8 md:p-12 shadow-lg border border-primary/20 backdrop-blur-sm max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Experience the Future of Healthcare?</h2>
          <p className="text-muted-foreground mb-6 max-w-[600px] mx-auto">
            Join thousands of patients and healthcare providers who are already benefiting from our revolutionary
            platform.
          </p>
          <GlowingButton asChild>
            <Link href="/auth/login" className="flex items-center justify-center">
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </GlowingButton>
        </div>
      </motion.div>
    </div>
  )
}

