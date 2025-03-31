"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GlowingButton } from "@/components/ui/glowing-button"
import { LoadingAnimation } from "@/components/loading-animation"
import { Heart, AlertCircle, Users } from "lucide-react"

export default function HeartDiseasePage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ risk: string; score: number } | null>(null)
  const [formData, setFormData] = useState({
    sex: "",
    generalHealth: "",
    physicalHealthDays: "",
    mentalHealthDays: "",
    lastCheckupTime: "",
    physicalActivities: "",
    sleepHours: "",
    removedTeeth: "",
    hadAngina: "",
    hadStroke: "",
    hadAsthma: "",
    hadCOPD: "",
    hadDepressiveDisorder: "",
    hadDiabetes: "",
    difficultyWalking: "",
    smokerStatus: "",
    ageCategory: "",
    bmi: "",
    alcoholDrinkers: "",
    covidPos: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()
      setResult({
        risk: data.risk,
        score: data.confidence,
      })
    } catch (error) {
      console.error("Error:", error)
      // Handle error (e.g., show error message to user)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container px-4 md:px-6 py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center space-y-4 mb-12"
      >
        <Badge className="mb-2" variant="outline">
          AI Diagnosis
        </Badge>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
          Heart Disease Analysis
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Complete the health assessment form for AI-powered heart disease risk prediction
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Health Assessment Form</CardTitle>
              <CardDescription>
                Fill out this comprehensive health assessment to analyze your heart disease risk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePredict} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sex">Sex (Gender Identity)</Label>
                    <Select onValueChange={(value) => handleChange("sex", value)}>
                      <SelectTrigger id="sex" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="generalHealth">General Health</Label>
                    <Select onValueChange={(value) => handleChange("generalHealth", value)}>
                      <SelectTrigger
                        id="generalHealth"
                        className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="veryGood">Very Good</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="physicalHealthDays">Physical Health Days</Label>
                    <Input
                      id="physicalHealthDays"
                      type="number"
                      placeholder="Days per month"
                      className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      onChange={(e) => handleChange("physicalHealthDays", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mentalHealthDays">Mental Health Days</Label>
                    <Input
                      id="mentalHealthDays"
                      type="number"
                      placeholder="Days per month"
                      className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      onChange={(e) => handleChange("mentalHealthDays", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastCheckupTime">Last Checkup Time</Label>
                    <Select onValueChange={(value) => handleChange("lastCheckupTime", value)}>
                      <SelectTrigger
                        id="lastCheckupTime"
                        className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="withinYear">Within past year</SelectItem>
                        <SelectItem value="1-2years">1-2 years ago</SelectItem>
                        <SelectItem value="2-5years">2-5 years ago</SelectItem>
                        <SelectItem value="5+years">5+ years ago</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sleepHours">Sleep Hours</Label>
                    <Input
                      id="sleepHours"
                      type="number"
                      placeholder="Hours per day"
                      className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      onChange={(e) => handleChange("sleepHours", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bmi">BMI (Weight Index)</Label>
                    <Input
                      id="bmi"
                      type="number"
                      placeholder="BMI value"
                      className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      onChange={(e) => handleChange("bmi", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ageCategory">Age Category</Label>
                    <Select onValueChange={(value) => handleChange("ageCategory", value)}>
                      <SelectTrigger
                        id="ageCategory"
                        className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18-24">18-24</SelectItem>
                        <SelectItem value="25-34">25-34</SelectItem>
                        <SelectItem value="35-44">35-44</SelectItem>
                        <SelectItem value="45-54">45-54</SelectItem>
                        <SelectItem value="55-64">55-64</SelectItem>
                        <SelectItem value="65+">65+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smokerStatus">Smoker Status</Label>
                    <Select onValueChange={(value) => handleChange("smokerStatus", value)}>
                      <SelectTrigger
                        id="smokerStatus"
                        className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">Current smoker</SelectItem>
                        <SelectItem value="former">Former smoker</SelectItem>
                        <SelectItem value="never">Never smoked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alcoholDrinkers">Alcohol Consumption</Label>
                    <Select onValueChange={(value) => handleChange("alcoholDrinkers", value)}>
                      <SelectTrigger
                        id="alcoholDrinkers"
                        className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="heavy">Heavy drinker</SelectItem>
                        <SelectItem value="moderate">Moderate drinker</SelectItem>
                        <SelectItem value="light">Light drinker</SelectItem>
                        <SelectItem value="none">Non-drinker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="physicalActivities">Physical Activities</Label>
                    <Select onValueChange={(value) => handleChange("physicalActivities", value)}>
                      <SelectTrigger
                        id="physicalActivities"
                        className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active (150+ min/week)</SelectItem>
                        <SelectItem value="moderate">Moderate (75-150 min/week)</SelectItem>
                        <SelectItem value="light\">Light (75 min/week)</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hadAngina">Had Angina</Label>
                    <Select onValueChange={(value) => handleChange("hadAngina", value)}>
                      <SelectTrigger
                        id="hadAngina"
                        className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hadStroke">Had Stroke</Label>
                    <Select onValueChange={(value) => handleChange("hadStroke", value)}>
                      <SelectTrigger
                        id="hadStroke"
                        className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hadAsthma">Had Asthma</Label>
                    <Select onValueChange={(value) => handleChange("hadAsthma", value)}>
                      <SelectTrigger
                        id="hadAsthma"
                        className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hadCOPD">Had COPD</Label>
                    <Select onValueChange={(value) => handleChange("hadCOPD", value)}>
                      <SelectTrigger id="hadCOPD" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hadDepressiveDisorder">Had Depressive Disorder</Label>
                    <Select onValueChange={(value) => handleChange("hadDepressiveDisorder", value)}>
                      <SelectTrigger
                        id="hadDepressiveDisorder"
                        className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hadDiabetes">Had Diabetes</Label>
                    <Select onValueChange={(value) => handleChange("hadDiabetes", value)}>
                      <SelectTrigger
                        id="hadDiabetes"
                        className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficultyWalking">Difficulty Walking</Label>
                    <Select onValueChange={(value) => handleChange("difficultyWalking", value)}>
                      <SelectTrigger
                        id="difficultyWalking"
                        className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No difficulty</SelectItem>
                        <SelectItem value="slight">Slight difficulty</SelectItem>
                        <SelectItem value="moderate">Moderate difficulty</SelectItem>
                        <SelectItem value="severe">Severe difficulty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="removedTeeth">Removed Teeth</Label>
                    <Select onValueChange={(value) => handleChange("removedTeeth", value)}>
                      <SelectTrigger
                        id="removedTeeth"
                        className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="1-5">1-5 teeth</SelectItem>
                        <SelectItem value="6+">6+ teeth</SelectItem>
                        <SelectItem value="all">All teeth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="covidPos">COVID-19 Status</Label>
                    <Select onValueChange={(value) => handleChange("covidPos", value)}>
                      <SelectTrigger
                        id="covidPos"
                        className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="positive">Positive (Current/Past)</SelectItem>
                        <SelectItem value="negative">Negative</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <GlowingButton type="submit" disabled={loading} className="w-full">
                    <Heart className="mr-2 h-4 w-4" />
                    {loading ? "Processing..." : "Analyze Heart Disease Risk"}
                  </GlowingButton>

                  <Link href="/doctors" className="w-full">
                    <Button variant="outline" className="w-full border-primary/20 bg-primary/5 hover:bg-primary/10">
                      <Users className="mr-2 h-4 w-4" />
                      Connect with a Doctor
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Risk Assessment Results</CardTitle>
              <CardDescription>
                Our AI will analyze your health data and provide a heart disease risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
              {loading ? (
                <LoadingAnimation />
              ) : result ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <Heart className="h-10 w-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Heart Disease Risk</h3>
                    <p className="text-3xl font-bold text-primary">{result.risk}</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-muted-foreground">Risk Score:</span>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {result.score}/100
                      </Badge>
                    </div>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-lg max-w-md mx-auto">
                    <p className="text-sm text-muted-foreground">
                      <AlertCircle className="inline h-4 w-4 mr-1 text-primary" />
                      This is an AI-assisted risk assessment and should be confirmed by a healthcare professional.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center space-y-4">
                  <Heart className="h-16 w-16 text-primary/20 mx-auto" />
                  <p className="text-muted-foreground">
                    Complete the health assessment form and click "Analyze Heart Disease Risk" to see your results here
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              {result && (
                <div className="text-center space-y-4 w-full">
                  <GlowingButton asChild className="w-full">
                    <Link href="/doctors">
                      <Users className="mr-2 h-4 w-4" />
                      Consult with a Cardiologist
                    </Link>
                  </GlowingButton>
                </div>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

