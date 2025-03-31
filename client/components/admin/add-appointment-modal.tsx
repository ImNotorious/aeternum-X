"use client"

import type React from "react"

import { useState } from "react"
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
    doctorName: "",
    department: "",
    date: new Date().toISOString().split("T")[0],
    time: "10:00",
    status: "confirmed",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock data for doctors and departments
  const doctors = [
    { name: "Dr. Sarah Johnson", department: "Cardiology" },
    { name: "Dr. Michael Chen", department: "Neurology" },
    { name: "Dr. Emily Rodriguez", department: "Dermatology" },
    { name: "Dr. James Wilson", department: "Orthopedics" },
  ]

  const departments = ["Cardiology", "Neurology", "Dermatology", "Orthopedics", "General Medicine", "Pediatrics"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // If doctor is selected, auto-fill department
    if (name === "doctorName") {
      const selectedDoctor = doctors.find((doctor) => doctor.name === value)
      if (selectedDoctor) {
        setFormData((prev) => ({ ...prev, department: selectedDoctor.department }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real application, you would make an API call here
      // For now, we'll simulate adding a new appointment
      const newAppointment = {
        id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
        patientName: formData.patientName,
        doctorName: formData.doctorName,
        department: formData.department,
        date: formData.date,
        time: formData.time,
        status: formData.status,
      }

      onAddAppointment(newAppointment)

      toast({
        title: "Appointment Added",
        description: `New appointment ${newAppointment.id} has been scheduled successfully.`,
      })

      // Reset form and close modal
      setFormData({
        patientName: "",
        doctorName: "",
        department: "",
        date: new Date().toISOString().split("T")[0],
        time: "10:00",
        status: "confirmed",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add appointment. Please try again.",
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doctorName">Doctor</Label>
              <Select value={formData.doctorName} onValueChange={(value) => handleSelectChange("doctorName", value)}>
                <SelectTrigger id="doctorName" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.name} value={doctor.name}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={formData.department} onValueChange={(value) => handleSelectChange("department", value)}>
                <SelectTrigger id="department" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

