"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Star, MessageSquare } from "lucide-react"
import { GlowingButton } from "@/components/ui/glowing-button"

export default function DoctorsPage() {
  const [mounted, setMounted] = useState(false)
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      rating: 4.9,
      reviews: 124,
      experience: "15 years",
      availability: "Available today",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      rating: 4.8,
      reviews: 98,
      experience: "12 years",
      availability: "Available tomorrow",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Dermatologist",
      rating: 4.7,
      reviews: 156,
      experience: "10 years",
      availability: "Available today",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialty: "Orthopedic Surgeon",
      rating: 4.9,
      reviews: 210,
      experience: "18 years",
      availability: "Available in 2 days",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 5,
      name: "Dr. Olivia Thompson",
      specialty: "Pediatrician",
      rating: 4.9,
      reviews: 178,
      experience: "14 years",
      availability: "Available today",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 6,
      name: "Dr. Robert Kim",
      specialty: "Psychiatrist",
      rating: 4.7,
      reviews: 132,
      experience: "11 years",
      availability: "Available tomorrow",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="flex flex-col gap-4">
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            Find a Doctor
          </h1>
          <p className="text-muted-foreground">
            Connect with verified medical professionals for consultations and treatments
          </p>
        </motion.div>

        <motion.div
          className="grid gap-4 md:grid-cols-4 my-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="md:col-span-3">
            <Input
              placeholder="Search by name, specialty, or condition"
              className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              <SelectItem value="cardiology">Cardiology</SelectItem>
              <SelectItem value="neurology">Neurology</SelectItem>
              <SelectItem value="dermatology">Dermatology</SelectItem>
              <SelectItem value="orthopedics">Orthopedics</SelectItem>
              <SelectItem value="pediatrics">Pediatrics</SelectItem>
              <SelectItem value="psychiatry">Psychiatry</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="overflow-hidden border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/10 hover:border-primary/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                      <AvatarImage src={doctor.avatar} alt={doctor.name} />
                      <AvatarFallback>
                        {doctor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{doctor.name}</CardTitle>
                      <CardDescription>{doctor.specialty}</CardDescription>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="text-sm font-medium">{doctor.rating}</span>
                        <span className="text-xs text-muted-foreground">({doctor.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Experience</span>
                      <span className="font-medium">{doctor.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Availability</span>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                      >
                        {doctor.availability}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-primary/20 bg-primary/5 hover:bg-primary/10"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                  <GlowingButton size="sm" className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book
                  </GlowingButton>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

