"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

type AddEmergencyModalProps = {
  isOpen: boolean
  onClose: () => void
  onAddEmergency: (emergency: any) => void
  availableAmbulances: any[]
}

export function AddEmergencyModal({ isOpen, onClose, onAddEmergency, availableAmbulances }: AddEmergencyModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    patientName: "",
    contactNumber: "",
    location: "",
    emergencyType: "Accident",
    ambulanceId: "",
    status: "dispatched",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authToken, setAuthToken] = useState<string | null>(null)

  useEffect(() => {
    // Get the Firebase auth token from localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("firebase-auth-token")
      setAuthToken(token)
    }
  }, [])

  const emergencyTypes = ["Accident", "Cardiac", "Respiratory", "Stroke", "Trauma", "Other"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Make an API call to create a new emergency
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      // Add auth token if available
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`
      }

      const response = await fetch("/api/emergency", {
        method: "POST",
        headers,
        body: JSON.stringify({
          patientName: formData.patientName,
          contactNumber: formData.contactNumber,
          location: formData.location,
          emergencyType: formData.emergencyType,
          ambulanceId: formData.ambulanceId || undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create emergency call")
      }

      const data = await response.json()

      onAddEmergency(data)

      toast({
        title: "Emergency Call Added",
        description: `New emergency call has been dispatched.`,
      })

      // Reset form and close modal
      setFormData({
        patientName: "",
        contactNumber: "",
        location: "",
        emergencyType: "Accident",
        ambulanceId: "",
        status: "dispatched",
      })
      onClose()
    } catch (error) {
      console.error("Error creating emergency:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add emergency call. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            Add Emergency Call
          </DialogTitle>
          <DialogDescription>Enter the details for the new emergency situation.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Enter patient name"
                className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="e.g. +91 98765 43210"
                className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter detailed location"
              className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyType">Emergency Type</Label>
              <Select
                value={formData.emergencyType}
                onValueChange={(value) => handleSelectChange("emergencyType", value)}
              >
                <SelectTrigger id="emergencyType" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {emergencyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ambulanceId">Assign Ambulance</Label>
              <Select value={formData.ambulanceId} onValueChange={(value) => handleSelectChange("ambulanceId", value)}>
                <SelectTrigger id="ambulanceId" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                  <SelectValue placeholder="Select ambulance" />
                </SelectTrigger>
                <SelectContent>
                  {availableAmbulances.map((ambulance) => (
                    <SelectItem key={ambulance.id} value={ambulance.id}>
                      {ambulance.id} - {ambulance.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
              <SelectTrigger id="status" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dispatched">Dispatched</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-primary/20 bg-primary/5">
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? "Dispatching..." : "Dispatch Ambulance"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

