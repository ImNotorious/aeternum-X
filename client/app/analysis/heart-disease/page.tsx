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
    e.preventDefault();
    setLoading(true);
  
    const requestData = {
      Sex: formData.sex,
      GeneralHealth: formData.generalHealth,
      PhysicalHealthDays: parseInt(formData.physicalHealthDays),
      MentalHealthDays: parseInt(formData.mentalHealthDays),
      LastCheckupTime: formData.lastCheckupTime,
      PhysicalActivities: formData.physicalActivities,
      SleepHours: parseInt(formData.sleepHours),
      RemovedTeeth: formData.removedTeeth,
      HadAngina: formData.hadAngina,
      HadStroke: formData.hadStroke,
      HadAsthma: formData.hadAsthma,
      HadCOPD: formData.hadCOPD,
      HadDepressiveDisorder: formData.hadDepressiveDisorder,
      HadDiabetes: formData.hadDiabetes,
      DifficultyWalking: formData.difficultyWalking,
      SmokerStatus: formData.smokerStatus,
      AgeCategory: formData.ageCategory,
      BMI: parseFloat(formData.bmi),
      AlcoholDrinkers: formData.alcoholDrinkers,
      CovidPos: formData.covidPos,
    };
  
    console.log('Request Data:', JSON.stringify(requestData, null, 2));
  
    try {
      const response = await fetch('https://heart-ml-api-bkl0.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }
  
      const data = await response.json();
      console.log('Response Data:', JSON.stringify(data, null, 2));
      setResult({
        risk: data.risk,
        score: data.confidence,
      });
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setLoading(false);
    }
  };
  
  
  
  
  
  

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
                        <SelectItem value="Female">Male</SelectItem>
                        <SelectItem value="Male">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="generalHealth">General Health</Label>
                    <Select onValueChange={(value) => handleChange("generalHealth", value)}>
                      <SelectTrigger id="generalHealth" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                        <SelectItem value="Very good">Very good</SelectItem>
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
                      <SelectTrigger id="lastCheckupTime" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5 or more years ago">5 or more years ago</SelectItem>
                        <SelectItem value="Within past 2 years (1 year but less than 2 years ago)">Within past 2 years (1 year but less than 2 years ago)</SelectItem>
                        <SelectItem value="Within past 5 years (2 years but less than 5 years ago)">Within past 5 years (2 years but less than 5 years ago)</SelectItem>
                        <SelectItem value="Within past year (anytime less than 12 months ago)">Within past year (anytime less than 12 months ago)</SelectItem>
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
                      <SelectTrigger id="ageCategory" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Age 18 to 24">Age 18 to 24</SelectItem>
                        <SelectItem value="Age 25 to 29">Age 25 to 29</SelectItem>
                        <SelectItem value="Age 30 to 34">Age 30 to 34</SelectItem>
                        <SelectItem value="Age 35 to 39">Age 35 to 39</SelectItem>
                        <SelectItem value="Age 40 to 44">Age 40 to 44</SelectItem>
                        <SelectItem value="Age 45 to 49">Age 45 to 49</SelectItem>
                        <SelectItem value="Age 50 to 54">Age 50 to 54</SelectItem>
                        <SelectItem value="Age 55 to 59">Age 55 to 59</SelectItem>
                        <SelectItem value="Age 60 to 64">Age 60 to 64</SelectItem>
                        <SelectItem value="Age 65 to 69">Age 65 to 69</SelectItem>
                        <SelectItem value="Age 70 to 74">Age 70 to 74</SelectItem>
                        <SelectItem value="Age 75 to 79">Age 75 to 79</SelectItem>
                        <SelectItem value="Age 80 or older">Age 80 or older</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smokerStatus">Smoker Status</Label>
                    <Select onValueChange={(value) => handleChange("smokerStatus", value)}>
                      <SelectTrigger id="smokerStatus" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Current smoker - now smokes every day">Current smoker - now smokes every day</SelectItem>
                        <SelectItem value="Current smoker - now smokes some days">Current smoker - now smokes some days</SelectItem>
                        <SelectItem value="Former smoker">Former smoker</SelectItem>
                        <SelectItem value="Never smoked">Never smoked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alcoholDrinkers">Alcohol Consumption</Label>
                    <Select onValueChange={(value) => handleChange("alcoholDrinkers", value)}>
                      <SelectTrigger id="alcoholDrinkers" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="physicalActivities">Physical Activities</Label>
                    <Select onValueChange={(value) => handleChange("physicalActivities", value)}>
                      <SelectTrigger id="physicalActivities" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hadAngina">Had Angina</Label>
                    <Select onValueChange={(value) => handleChange("hadAngina", value)}>
                      <SelectTrigger id="hadAngina" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hadStroke">Had Stroke</Label>
                    <Select onValueChange={(value) => handleChange("hadStroke", value)}>
                      <SelectTrigger id="hadStroke" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hadAsthma">Had Asthma</Label>
                    <Select onValueChange={(value) => handleChange("hadAsthma", value)}>
                      <SelectTrigger id="hadAsthma" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
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
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hadDepressiveDisorder">Had Depressive Disorder</Label>
                    <Select onValueChange={(value) => handleChange("hadDepressiveDisorder", value)}>
                      <SelectTrigger id="hadDepressiveDisorder" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hadDiabetes">Had Diabetes</Label>
                    <Select onValueChange={(value) => handleChange("hadDiabetes", value)}>
                      <SelectTrigger id="hadDiabetes" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="No, pre-diabetes or borderline diabetes">No, pre-diabetes or borderline diabetes</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="Yes, but only during pregnancy (female)">Yes, but only during pregnancy (female)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficultyWalking">Difficulty Walking</Label>
                    <Select onValueChange={(value) => handleChange("difficultyWalking", value)}>
                      <SelectTrigger id="difficultyWalking" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="removedTeeth">Removed Teeth</Label>
                    <Select onValueChange={(value) => handleChange("removedTeeth", value)}>
                      <SelectTrigger id="removedTeeth" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 to 5">1 to 5</SelectItem>
                        <SelectItem value="6 or more, but not all">6 or more, but not all</SelectItem>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="None of them">None of them</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="covidPos">COVID-19 Status</Label>
                    <Select onValueChange={(value) => handleChange("covidPos", value)}>
                      <SelectTrigger id="covidPos" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Tested positive using home test without a health professional">Tested positive using home test without a health professional</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
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
                    <Button
                      variant="outline"
                      className="w-full border-primary/20 bg-primary/5 hover:bg-primary/10"
                    >
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