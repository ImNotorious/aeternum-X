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

type AddAmbulanceModalProps = {
  isOpen: boolean
  onClose: () => void
  onAddAmbulance: (ambulance: any) => void
}

export function AddAmbulanceModal({ isOpen, onClose, onAddAmbulance }: AddAmbulanceModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    driverName: "",
    vehicleNumber: "",
    status: "available",
    location: "",
    lastService: new Date().toISOString().split("T")[0],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Generate a temporary ID for optimistic UI update
      const tempId = `AMB-${Math.floor(1000 + Math.random() * 9000)}`

      // Create the ambulance object
      const newAmbulance = {
        id: tempId,
        driverName: formData.driverName,
        vehicleNumber: formData.vehicleNumber,
        status: formData.status,
        location: formData.location,
        lastService: formData.lastService,
      }

      // First update the UI optimistically
      onAddAmbulance(newAmbulance)

      // Get the current Firebase auth token if available
      let authHeaders = {}
      if (typeof window !== "undefined" && window.localStorage.getItem("firebase-auth-token")) {
        authHeaders = {
          Authorization: `Bearer ${window.localStorage.getItem("firebase-auth-token")}`,
        }
      }

      // Then save to the database
      const response = await fetch("/api/ambulances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(newAmbulance),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add ambulance")
      }

      const result = await response.json()

      toast({
        title: "Ambulance Added",
        description: `New ambulance ${newAmbulance.id} has been added successfully.`,
      })

      // Reset form and close modal
      setFormData({
        driverName: "",
        vehicleNumber: "",
        status: "available",
        location: "",
        lastService: new Date().toISOString().split("T")[0],
      })
      onClose()
    } catch (error) {
      console.error("Error adding ambulance:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add ambulance. Please try again.",
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
            Add New Ambulance
          </DialogTitle>
          <DialogDescription>Enter the details for the new ambulance to add to the fleet.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="driverName">Driver Name</Label>
              <Input
                id="driverName"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                placeholder="Enter driver name"
                className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleNumber">Vehicle Number</Label>
              <Input
                id="vehicleNumber"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                placeholder="e.g. DL 01 AB 1234"
                className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger id="status" className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="on_call">On Call</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Current location"
                className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastService">Last Service Date</Label>
            <Input
              id="lastService"
              name="lastService"
              type="date"
              value={formData.lastService}
              onChange={handleChange}
              className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-primary/20 bg-primary/5">
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Ambulance"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

