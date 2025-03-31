"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { GlowingButton } from "@/components/ui/glowing-button"
import Link from "next/link"
import { ArrowRight, Brain, Shield, Zap, Clock } from "lucide-react"

export default function LearnMorePage() {
  const technologies = [
    {
      icon: <Brain className="h-10 w-10 text-primary" />,
      title: "Artificial Intelligence",
      description:
        "Our AI models are trained on millions of medical images to provide highly accurate diagnoses. We use deep learning techniques to identify patterns that might be missed by human eyes.",
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Blockchain Technology",
      description:
        "We utilize blockchain to create immutable, secure medical records. This ensures data integrity while giving patients control over who can access their information.",
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Smart Contracts",
      description:
        "Automated smart contracts handle payments, appointments, and data access permissions, eliminating intermediaries and reducing costs.",
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
      question: "How is my medical data protected?",
      answer:
        "Your medical data is encrypted and stored on the blockchain, making it virtually impossible to alter or access without proper authorization. You control who can access your records through our permission system.",
    },
    {
      question: "Can I use the platform without cryptocurrency?",
      answer:
        "Yes, while we support cryptocurrency payments for their security and efficiency, we also accept traditional payment methods like credit cards and bank transfers.",
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
          Explore how our platform is revolutionizing healthcare through AI and blockchain technology
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
                healthcare platform. Our unique combination of artificial intelligence and blockchain creates a system
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

            <div className="mt-12 max-w-3xl mx-auto">
              <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>How It All Works Together</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Our platform integrates these technologies into a seamless workflow:
                  </p>
                  <ol className="space-y-4">
                    <li className="flex gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20 shrink-0">
                        <span className="text-sm font-bold text-primary">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Medical Image Upload</p>
                        <p className="text-sm text-muted-foreground">
                          Patients or healthcare providers upload medical images to the platform.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20 shrink-0">
                        <span className="text-sm font-bold text-primary">2</span>
                      </div>
                      <div>
                        <p className="font-medium">AI Analysis</p>
                        <p className="text-sm text-muted-foreground">
                          Our AI models analyze the images in real-time, identifying potential issues with high
                          accuracy.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20 shrink-0">
                        <span className="text-sm font-bold text-primary">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Blockchain Storage</p>
                        <p className="text-sm text-muted-foreground">
                          Results and images are encrypted and stored on the blockchain, creating an immutable record.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20 shrink-0">
                        <span className="text-sm font-bold text-primary">4</span>
                      </div>
                      <div>
                        <p className="font-medium">Doctor Review</p>
                        <p className="text-sm text-muted-foreground">
                          Healthcare providers can access the results (with patient permission) and provide expert
                          opinions.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20 shrink-0">
                        <span className="text-sm font-bold text-primary">5</span>
                      </div>
                      <div>
                        <p className="font-medium">Smart Contract Execution</p>
                        <p className="text-sm text-muted-foreground">
                          Payments and data access are handled automatically through secure smart contracts.
                        </p>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>
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

