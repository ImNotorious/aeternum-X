"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GlowingButton } from "@/components/ui/glowing-button"
import { useToast } from "@/hooks/use-toast"
import { Ambulance, MapPin, Phone, AlertTriangle, Clock, CheckCircle } from "lucide-react"

// Import map component dynamically to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
      <p className="text-sm text-muted-foreground">Loading map...</p>
    </div>
  ),
})

export default function EmergencyRequestPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [requestStatus, setRequestStatus] = useState<"pending" | "dispatched" | "en-route" | "arrived" | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [ambulanceLocation, setAmbulanceLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [emergencyDetails, setEmergencyDetails] = useState({
    patientName: "",
    contactNumber: "",
    emergencyType: "",
    description: "",
    location: "",
  })

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enable location services.",
            variant: "destructive",
          })
          // Set default location (example: New Delhi)
          setUserLocation({ lat: 28.6139, lng: 77.209 })
        },
      )
    }
  }, [toast])

  // Simulate ambulance movement (in a real app, this would come from a backend)
  useEffect(() => {
    if (requestStatus === "dispatched" || requestStatus === "en-route") {
      // Start with ambulance at a distance from the user
      if (!ambulanceLocation && userLocation) {
        setAmbulanceLocation({
          lat: userLocation.lat + 0.01,
          lng: userLocation.lng + 0.01,
        })
      }

      // Move ambulance closer to user location
      const interval = setInterval(() => {
        if (ambulanceLocation && userLocation) {
          const newLat = ambulanceLocation.lat + (userLocation.lat - ambulanceLocation.lat) * 0.1
          const newLng = ambulanceLocation.lng + (userLocation.lng - ambulanceLocation.lng) * 0.1

          setAmbulanceLocation({ lat: newLat, lng: newLng })

          // Check if ambulance has arrived (close enough to user)
          const distance = Math.sqrt(Math.pow(newLat - userLocation.lat, 2) + Math.pow(newLng - userLocation.lng, 2))

          if (distance < 0.0005 && requestStatus === "en-route") {
            setRequestStatus("arrived")
            clearInterval(interval)
          }
        }
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [requestStatus, ambulanceLocation, userLocation])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate form
    if (!emergencyDetails.patientName || !emergencyDetails.contactNumber || !emergencyDetails.emergencyType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      // In a real app, this would be an API call to request an ambulance
      // await fetch('/api/emergency', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...emergencyDetails,
      //     coordinates: userLocation
      //   }),
      // })

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Emergency Request Sent",
        description: "Your request has been received. An ambulance will be dispatched shortly.",
      })

      setStep(2)
      setRequestStatus("pending")

      // Simulate ambulance being dispatched after a delay
      setTimeout(() => {
        setRequestStatus("dispatched")

        // Simulate ambulance en-route after another delay
        setTimeout(() => {
          setRequestStatus("en-route")
        }, 5000)
      }, 5000)
    } catch (error) {
      console.error("Error requesting ambulance:", error)
      toast({
        title: "Request Failed",
        description:
          "There was a problem sending your emergency request. Please try again or call emergency services directly.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-2 mb-8"
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
          Emergency Ambulance Request
        </h1>
        <p className="text-muted-foreground">Request an ambulance for medical emergencies</p>
      </motion.div>

      {step === 1 ? (
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
                <CardDescription>Please provide information about the emergency situation</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="emergency-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input
                      id="patientName"
                      placeholder="Enter patient name"
                      className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      value={emergencyDetails.patientName}
                      onChange={(e) => setEmergencyDetails({ ...emergencyDetails, patientName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                      id="contactNumber"
                      placeholder="Enter contact number"
                      className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      value={emergencyDetails.contactNumber}
                      onChange={(e) => setEmergencyDetails({ ...emergencyDetails, contactNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyType">Emergency Type</Label>
                    <Select
                      onValueChange={(value) => setEmergencyDetails({ ...emergencyDetails, emergencyType: value })}
                      required
                    >
                      <SelectTrigger
                        id="emergencyType"
                        className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      >
                        <SelectValue placeholder="Select emergency type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cardiac">Cardiac Emergency</SelectItem>
                        <SelectItem value="respiratory">Respiratory Distress</SelectItem>
                        <SelectItem value="trauma">Trauma/Injury</SelectItem>
                        <SelectItem value="stroke">Stroke Symptoms</SelectItem>
                        <SelectItem value="allergic">Severe Allergic Reaction</SelectItem>
                        <SelectItem value="other">Other Medical Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Additional Details</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the emergency situation"
                      className="border-primary/20 bg-primary/5 focus-visible:ring-primary min-h-[100px]"
                      value={emergencyDetails.description}
                      onChange={(e) => setEmergencyDetails({ ...emergencyDetails, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Address (Optional)</Label>
                    <Input
                      id="location"
                      placeholder="Enter address details to help the ambulance locate you"
                      className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      value={emergencyDetails.location}
                      onChange={(e) => setEmergencyDetails({ ...emergencyDetails, location: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Your current location will be automatically shared with the ambulance service
                    </p>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <GlowingButton type="submit" form="emergency-form" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="animate-pulse mr-2">●</span>
                      Processing Request...
                    </>
                  ) : (
                    <>
                      <Ambulance className="mr-2 h-4 w-4" />
                      Request Ambulance
                    </>
                  )}
                </GlowingButton>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle>Your Location</CardTitle>
                <CardDescription>
                  This is your current location that will be shared with emergency services
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {userLocation ? (
                  <MapComponent
                    center={userLocation}
                    zoom={15}
                    markers={[
                      {
                        position: userLocation,
                        popup: "Your current location",
                        icon: "user",
                      },
                    ]}
                  />
                ) : (
                  <div className="h-[300px] w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    <div className="text-center p-4">
                      <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Accessing your location...</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <p>In case of severe emergency, please also call emergency services directly.</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-primary/20 bg-primary/5 hover:bg-primary/10"
                  onClick={() => {
                    // In a real app, this would call the emergency number
                    toast({
                      title: "Emergency Call",
                      description: "This would initiate an emergency call in a real application.",
                    })
                  }}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Emergency Services
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Ambulance Status</CardTitle>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${requestStatus ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`}
                  ></div>
                  <span className="text-sm font-medium">
                    {requestStatus === "pending" && "Finding ambulance..."}
                    {requestStatus === "dispatched" && "Ambulance dispatched"}
                    {requestStatus === "en-route" && "Ambulance en route"}
                    {requestStatus === "arrived" && "Ambulance arrived"}
                  </span>
                </div>
              </div>
              <CardDescription>Track your ambulance in real-time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-[400px] w-full rounded-lg overflow-hidden">
                {userLocation ? (
                  <MapComponent
                    center={userLocation}
                    zoom={15}
                    markers={[
                      {
                        position: userLocation,
                        popup: "Your location",
                        icon: "user",
                      },
                      ...(ambulanceLocation
                        ? [
                            {
                              position: ambulanceLocation,
                              popup: "Ambulance location",
                              icon: "ambulance",
                            },
                          ]
                        : []),
                    ]}
                    polyline={ambulanceLocation ? [ambulanceLocation, userLocation] : undefined}
                  />
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Loading map...</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Estimated arrival time</p>
                    <p className="text-lg font-semibold">
                      {requestStatus === "pending" && "Calculating..."}
                      {requestStatus === "dispatched" && "10-12 minutes"}
                      {requestStatus === "en-route" && "5-7 minutes"}
                      {requestStatus === "arrived" && "Arrived"}
                    </p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Ambulance ID</p>
                    <p className="text-lg font-semibold">{requestStatus === "pending" ? "Assigning..." : "AMB-1004"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Status Updates</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Emergency request received</p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date().toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {(requestStatus === "dispatched" ||
                      requestStatus === "en-route" ||
                      requestStatus === "arrived") && (
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Ambulance dispatched</p>
                          <p className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(Date.now() - 5000).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {(requestStatus === "en-route" || requestStatus === "arrived") && (
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Ambulance en route to your location</p>
                          <p className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(Date.now() - 10000).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {requestStatus === "arrived" && (
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Ambulance arrived at your location</p>
                          <p className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date().toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                variant="outline"
                className="w-full border-primary/20 bg-primary/5 hover:bg-primary/10"
                onClick={() => {
                  // In a real app, this would call the ambulance driver
                  toast({
                    title: "Contact Driver",
                    description: "This would initiate a call to the ambulance driver in a real application.",
                  })
                }}
              >
                <Phone className="mr-2 h-4 w-4" />
                Contact Ambulance Driver
              </Button>

              <Button
                variant="outline"
                className="w-full border-destructive/20 bg-destructive/5 hover:bg-destructive/10 text-destructive"
                onClick={() => {
                  // In a real app, this would cancel the request
                  toast({
                    title: "Request Cancelled",
                    description: "Your emergency request has been cancelled.",
                  })
                  setStep(1)
                  setRequestStatus(null)
                  setAmbulanceLocation(null)
                }}
              >
                Cancel Request
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

