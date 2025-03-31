"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GlowingButton } from "@/components/ui/glowing-button"
import { LoadingAnimation } from "@/components/loading-animation"
import { Upload, FileImage, AlertCircle, CheckCircle, Users } from "lucide-react"

type PredictionResult = {
  condition: string
  confidence: number
  additional_info?: string
}

export default function ChestDiseasePage() {
  const [image, setImage] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "application/dicom"]
      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type")
        return
      }
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        setResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePredict = async () => {
    if (!image || !fileName) return

    setLoading(true)
    try {
      const formData = new FormData()
      const blob = await fetch(image).then((res) => res.blob())
      formData.append("file", blob, fileName)

      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Prediction failed")

      const data = await response.json()
      setResult({
        condition: data.condition,
        confidence: data.confidence,
        additional_info: data.additional_info,
      })
    } catch (error) {
      console.error("Prediction error:", error)
      setResult({
        condition: "Analysis Error",
        confidence: 0,
        additional_info: "An error occurred during analysis. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
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
          Chest Disease Analysis
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Upload a chest X-ray image for AI-powered diagnosis of respiratory conditions
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Upload X-Ray Image</CardTitle>
              <CardDescription>
                Upload a clear chest X-ray image in JPG, PNG, or DICOM format for best results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px] cursor-pointer transition-colors ${
                  image ? "border-primary/50" : "border-primary/20 hover:border-primary/40"
                }`}
                onClick={triggerFileInput}
              >
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUpload} />

                {image ? (
                  <div className="relative w-full h-[250px]">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt="Chest X-ray"
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <FileImage className="h-16 w-16 text-primary/40 mb-4" />
                    <p className="text-lg font-medium mb-2">Drag & drop or click to upload</p>
                    <p className="text-sm text-muted-foreground">Supported formats: JPG, PNG, DICOM (max 10MB)</p>
                  </div>
                )}
              </div>
              {fileName && (
                <div className="flex items-center justify-between bg-primary/5 p-3 rounded-lg">
                  <div className="flex items-center">
                    <FileImage className="h-5 w-5 text-primary mr-2" />
                    <span className="text-sm font-medium truncate max-w-[200px]">{fileName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive/90"
                    onClick={() => {
                      setImage(null)
                      setFileName(null)
                      setResult(null)
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <GlowingButton onClick={handlePredict} disabled={!image || loading} className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  {loading ? "Processing..." : "Analyze X-Ray"}
                </GlowingButton>

                <Link href="/doctors" className="w-full">
                  <Button variant="outline" className="w-full border-primary/20 bg-primary/5 hover:bg-primary/10">
                    <Users className="mr-2 h-4 w-4" />
                    Connect with a Doctor
                  </Button>
                </Link>
              </div>
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
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                Our AI will analyze the X-ray and provide a diagnosis with confidence score
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
                    <CheckCircle className="h-10 w-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Detected Condition</h3>
                    <p className="text-3xl font-bold text-primary">{result.condition}</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-muted-foreground">Confidence:</span>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {result.confidence}%
                      </Badge>
                    </div>
                  </div>
                  {result.additional_info && (
                    <div className="mt-4 p-3 bg-accent/10 rounded-lg text-sm">
                      <p className="text-muted-foreground">{result.additional_info}</p>
                    </div>
                  )}
                  <div className="bg-primary/5 p-4 rounded-lg max-w-md mx-auto">
                    <p className="text-sm text-muted-foreground">
                      <AlertCircle className="inline h-4 w-4 mr-1 text-primary" />
                      This is an AI-assisted diagnosis and should be confirmed by a healthcare professional.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center space-y-4">
                  <FileImage className="h-16 w-16 text-primary/20 mx-auto" />
                  <p className="text-muted-foreground">
                    Upload an X-ray image and click "Analyze X-Ray" to see the results here
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
                      Consult with a Specialist
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

