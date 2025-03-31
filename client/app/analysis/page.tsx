"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TreesIcon as Lungs, Heart, ArrowRight } from "lucide-react"

export default function AnalysisPage() {
  return (
    <div className="container px-4 md:px-6 py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center space-y-4 mb-12 md:mb-20"
      >
        <Badge className="mb-2" variant="outline">
          AI Analysis
        </Badge>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
          Medical Diagnosis
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Choose the type of analysis you want to perform using our advanced AI
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -10, transition: { duration: 0.2 } }}
        >
          <Link href="/analysis/chest-disease" className="block h-full">
            <Card className="h-full border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/10 hover:border-primary/50 group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                  <Lungs className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl transition-colors duration-300 group-hover:text-primary">
                  Chest Disease Analysis
                </CardTitle>
                <CardDescription>
                  Upload chest X-ray images for AI-powered diagnosis of respiratory conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Our advanced AI can detect pneumonia, tuberculosis, COVID-19, and other respiratory conditions from
                  chest X-ray images with high accuracy.
                </p>
                <div className="flex justify-center">
                  <div className="inline-flex items-center text-primary font-medium">
                    Start Analysis
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -10, transition: { duration: 0.2 } }}
        >
          <Link href="/analysis/heart-disease" className="block h-full">
            <Card className="h-full border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/10 hover:border-primary/50 group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                  <Heart className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl transition-colors duration-300 group-hover:text-primary">
                  Heart Disease Analysis
                </CardTitle>
                <CardDescription>
                  Complete a comprehensive health assessment for heart disease risk prediction
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Our AI model analyzes your health data to predict heart disease risk factors and provide personalized
                  recommendations.
                </p>
                <div className="flex justify-center">
                  <div className="inline-flex items-center text-primary font-medium">
                    Start Analysis
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

