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

type AddAppointmentModalProps = {
  isOpen: boolean
  onClose: () => void
  onAddAppointment: (appointment: any) => void
}

export function AddAppointmentModal({ isOpen, onClose, onAddAppointment }: AddAppointmentModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    patientName: "",
    doctorId: "",
    date: new Date().toISOString().split("T")[0],
    time: "10:00",
    status: "confirmed",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [doctors, setDoctors] = useState<any[]>([])
  const [authToken, setAuthToken] = useState<string | null>(null)

  useEffect(() => {
    // Get the Firebase auth token from localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("firebase-auth-token")
      setAuthToken(token)
    }

    // Fetch doctors list
    const fetchDoctors = async () => {
      try {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        }

        if (authToken) {
          headers["Authorization"] = `Bearer ${authToken}`
        }

        const response = await fetch("/api/doctors", {
          headers,
        })

        if (response.ok) {
          const data = await response.json()
          setDoctors(data)
        }
      } catch (error) {
        console.error("Error fetching doctors:", error)
      }
    }

    fetchDoctors()
  }, [authToken])

  const departments = ["Cardiology", "Neurology", "Dermatology", "Orthopedics", "General Medicine", "Pediatrics"]

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
      // Make an API call to create a new appointment
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      // Add auth token if available
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`
      }

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers,
        body: JSON.stringify({
          patientName: formData.patientName,
          doctorId: formData.doctorId,
          date: formData.date,
          time: formData.time,
          status: formData.status,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create appointment")
      }

      const data = await response.json()

      onAddAppointment(data)

      toast({
        title: "Appointment Added",
        description: `New appointment has been scheduled successfully.`,
      })

      // Reset form and close modal
      setFormData({
        patientName: "",
        doctorId: "",
        date: new Date().toISOString().split("T")[0],
        time: "10:00",
        status: "confirmed",
      })
      onClose()
    } catch (error) {
      console.error("Error creating appointment:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add appointment. Please try again.",
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
            Schedule New Appointment
          </DialogTitle>
          <DialogDescription>Enter the details to schedule a new patient appointment.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="doctorId">Doctor</Label>
            <Select value={formData.doctorId} onValueChange={(value) => handleSelectChange("doctorId", value)}>
              <SelectTrigger id="doctorId" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor._id} value={doctor._id}>
                    {doctor.name} - {doctor.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
              <SelectTrigger id="status" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-primary/20 bg-primary/5">
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

