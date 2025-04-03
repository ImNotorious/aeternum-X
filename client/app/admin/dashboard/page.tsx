"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  Ambulance,
  Calendar,
  CreditCard,
  Activity,
  BarChart3,
  Search,
  PlusCircle,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Trash2,
} from "lucide-react"
import { AddAmbulanceModal } from "@/components/admin/add-ambulance-modal"
import { AddAppointmentModal } from "@/components/admin/add-appointment-modal"
import { AddEmergencyModal } from "@/components/admin/add-emergency-modal"

// Define the structure for Ambulance
interface AmbulanceType {
  id: string
  driverName: string
  vehicleNumber: string
  status: string // e.g., "available", "on_call", "maintenance"
  location: string
  lastService: string
}

// Define the structure for Appointment
interface Appointment {
  id: string
  patientName: string
  doctorName: string
  date: string
  time: string
  status: string // e.g., "confirmed", "completed", "cancelled", "pending"
  department: string
}

// Define the structure for Emergency Call
interface Emergency {
  id: string
  patientName: string
  contactNumber: string
  location: string
  emergencyType: string // e.g., "Cardiac", "Accident"
  status: string // e.g., "dispatched", "in_progress", "completed"
  ambulanceId?: string // Optional, as not all emergencies may have an ambulance assigned
  timestamp: string
}

// Update the AdminDashboardPage component to fetch data from the API
export default function AdminDashboardPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [ambulances, setAmbulances] = useState<AmbulanceType[]>([])
  const [emergencyCalls, setEmergencyCalls] = useState<Emergency[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Add state for modals
  const [isAddAmbulanceModalOpen, setIsAddAmbulanceModalOpen] = useState(false)
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] = useState(false)
  const [isAddEmergencyModalOpen, setIsAddEmergencyModalOpen] = useState(false)

  // Add loading states
  const [isLoadingAmbulances, setIsLoadingAmbulances] = useState(true)
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true)
  const [isLoadingEmergencies, setIsLoadingEmergencies] = useState(true)

  // Get auth token
  const [authToken, setAuthToken] = useState<string | null>(null)

  useEffect(() => {
    // Get the Firebase auth token from localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("firebase-auth-token")
      setAuthToken(token)
    }
  }, [])

  // Fetch ambulances from the database on component mount
  useEffect(() => {
    const fetchAmbulances = async () => {
      setIsLoadingAmbulances(true)
      try {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        }

        if (authToken) {
          headers["Authorization"] = `Bearer ${authToken}`
        }

        const response = await fetch("/api/ambulances", {
          headers,
        })

        if (response.ok) {
          const data = await response.json()
          if (data && Array.isArray(data) && data.length > 0) {
            // Format the data to match our interface
            const formattedData = data.map((item: any) => ({
              id: item._id || item.id,
              driverName: item.driverName,
              vehicleNumber: item.vehicleNumber,
              status: item.status,
              location: item.location,
              lastService: item.lastService,
            }))
            setAmbulances(formattedData)
          }
        } else {
          throw new Error("Failed to fetch ambulances")
        }
      } catch (error) {
        console.error("Error fetching ambulances:", error)
        toast({
          title: "Error",
          description: "Failed to load ambulances. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingAmbulances(false)
      }
    }

    if (authToken) {
      fetchAmbulances()
    }
  }, [toast, authToken])

  // Fetch appointments from the database
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoadingAppointments(true)
      try {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        }

        if (authToken) {
          headers["Authorization"] = `Bearer ${authToken}`
        }

        const response = await fetch("/api/appointments", {
          headers,
        })

        if (response.ok) {
          const data = await response.json()
          if (data && Array.isArray(data) && data.length > 0) {
            // Format the data to match our interface
            const formattedData = data.map((item: any) => ({
              id: item._id || item.id,
              patientName: item.patientName,
              doctorName: item.doctorName || "Dr. Unknown",
              date: item.date,
              time: item.time,
              status: item.status,
              department: item.department || "General",
            }))
            setAppointments(formattedData)
          }
        } else {
          throw new Error("Failed to fetch appointments")
        }
      } catch (error) {
        console.error("Error fetching appointments:", error)
        toast({
          title: "Error",
          description: "Failed to load appointments. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingAppointments(false)
      }
    }

    if (authToken) {
      fetchAppointments()
    }
  }, [toast, authToken])

  // Fetch emergency calls from the database
  useEffect(() => {
    const fetchEmergencyCalls = async () => {
      setIsLoadingEmergencies(true)
      try {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        }

        if (authToken) {
          headers["Authorization"] = `Bearer ${authToken}`
        }

        const response = await fetch("/api/emergency", {
          headers,
        })

        if (response.ok) {
          const data = await response.json()
          if (data && Array.isArray(data) && data.length > 0) {
            // Format the data to match our interface
            const formattedData = data.map((item: any) => ({
              id: item._id || item.id,
              patientName: item.patientName,
              contactNumber: item.contactNumber,
              location: item.location,
              emergencyType: item.emergencyType,
              status: item.status,
              ambulanceId: item.ambulanceId,
              timestamp: item.timestamp || new Date().toISOString(),
            }))
            setEmergencyCalls(formattedData)
          }
        } else {
          throw new Error("Failed to fetch emergency calls")
        }
      } catch (error) {
        console.error("Error fetching emergency calls:", error)
        toast({
          title: "Error",
          description: "Failed to load emergency calls. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingEmergencies(false)
      }
    }

    if (authToken) {
      fetchEmergencyCalls()
    }
  }, [toast, authToken])

  // Function to handle adding a new ambulance
  const handleAddAmbulance = (newAmbulance: AmbulanceType) => {
    setAmbulances((prev) => [newAmbulance, ...prev])
  }

  // Function to handle adding a new appointment
  const handleAddAppointment = (newAppointment: Appointment) => {
    setAppointments((prev) => [newAppointment, ...prev])
  }

  // Function to handle adding a new emergency call
  const handleAddEmergency = (newEmergency: Emergency) => {
    setEmergencyCalls((prev) => [
      {
        ...newEmergency,
        ambulanceId: newEmergency.ambulanceId ?? "", // Provide a default empty string if undefined
      },
      ...prev,
    ])

    // Update ambulance status to "on_call"
    if (newEmergency.ambulanceId) {
      setAmbulances((prev) =>
        prev.map((ambulance) =>
          ambulance.id === newEmergency.ambulanceId ? { ...ambulance, status: "on_call" } : ambulance,
        ),
      )
    }
  }

  // Filter appointments based on search query and status
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      (appointment.patientName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (appointment.doctorName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (appointment.id?.toLowerCase() || "").includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Filter ambulances based on status
  const filteredAmbulances = ambulances.filter((ambulance) => {
    return statusFilter === "all" || ambulance.status === statusFilter
  })

  // Get available ambulances for emergency calls
  const availableAmbulances = ambulances.filter((ambulance) => ambulance.status === "available")

  // Stats for overview
  const stats = {
    totalAppointments: appointments.length,
    confirmedAppointments: appointments.filter((a) => a.status === "confirmed").length,
    totalAmbulances: ambulances.length,
    availableAmbulances: ambulances.filter((a) => a.status === "available").length,
    activeEmergencies: emergencyCalls.filter((c) => c.status === "in_progress" || c.status === "dispatched").length,
    totalRevenue: "₹45,250", // This could be calculated from actual payment data in a real app
  }

  // Loading state for the entire dashboard
  const isLoading = isLoadingAmbulances || isLoadingAppointments || isLoadingEmergencies

  // Function to update ambulance status in the database
  const updateAmbulanceStatus = async (ambulanceId: string, newStatus: string) => {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`
      }

      const response = await fetch("/api/ambulances", {
        method: "PUT",
        headers,
        body: JSON.stringify({
          id: ambulanceId,
          status: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update ambulance status")
      }
    } catch (error) {
      console.error("Error updating ambulance status:", error)
      toast({
        title: "Error",
        description: "Failed to update ambulance status. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Function to remove ambulance from the database
  const removeAmbulance = async (ambulanceId: string) => {
    if (!confirm("Are you sure you want to remove this ambulance?")) {
      return
    }

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`
      }

      const response = await fetch(`/api/ambulances?id=${ambulanceId}`, {
        method: "DELETE",
        headers,
      })

      if (!response.ok) {
        throw new Error("Failed to remove ambulance")
      }

      // Update the UI by removing the ambulance from the state
      setAmbulances((prev) => prev.filter((ambulance) => ambulance.id !== ambulanceId))

      toast({
        title: "Ambulance Removed",
        description: `Ambulance ${ambulanceId} has been removed successfully.`,
      })
    } catch (error) {
      console.error("Error removing ambulance:", error)
      toast({
        title: "Error",
        description: "Failed to remove ambulance. Please try again.",
        variant: "destructive",
      })
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
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">Manage hospital operations, appointments, and emergency services</p>
      </motion.div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-primary/10 p-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Appointments
            </TabsTrigger>
            <TabsTrigger
              value="ambulances"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Ambulance className="h-4 w-4 mr-2" />
              Ambulances
            </TabsTrigger>
            <TabsTrigger
              value="emergency"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Activity className="h-4 w-4 mr-2" />
              Emergency Calls
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalAppointments}</div>
                  <p className="text-xs text-muted-foreground">{stats.confirmedAppointments} confirmed for today</p>
                </CardContent>
              </Card>
              <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Ambulance Fleet</CardTitle>
                  <Ambulance className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalAmbulances}</div>
                  <p className="text-xs text-muted-foreground">{stats.availableAmbulances} currently available</p>
                </CardContent>
              </Card>
              <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Emergencies</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeEmergencies}</div>
                  <p className="text-xs text-muted-foreground">
                    {emergencyCalls.filter((c) => c.status === "in_progress").length} in progress
                  </p>
                </CardContent>
              </Card>
              <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalRevenue}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Appointments</CardTitle>
                  <CardDescription>Latest 5 appointments across all departments</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingAppointments ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  ) : appointments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No appointments found. Add your first appointment.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Doctor</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments.slice(0, 5).map((appointment) => (
                          <TableRow key={appointment.id}>
                            <TableCell className="font-medium">{appointment.patientName}</TableCell>
                            <TableCell>{appointment.doctorName}</TableCell>
                            <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  appointment.status === "confirmed"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800"
                                    : appointment.status === "completed"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800"
                                      : appointment.status === "cancelled"
                                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800"
                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800"
                                }
                              >
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Emergency Calls</CardTitle>
                  <CardDescription>Active and recent emergency calls</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingEmergencies ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  ) : emergencyCalls.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No emergency calls found. Add your first emergency call.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {emergencyCalls.map((call) => (
                          <TableRow key={call.id}>
                            <TableCell className="font-medium">{call.patientName}</TableCell>
                            <TableCell>{call.emergencyType}</TableCell>
                            <TableCell className="truncate max-w-[150px]">{call.location}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  call.status === "dispatched"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800"
                                    : call.status === "completed"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800"
                                      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800"
                                }
                              >
                                {call.status === "dispatched"
                                  ? "Dispatched"
                                  : call.status === "in_progress"
                                    ? "In Progress"
                                    : "Completed"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search appointments..."
                    className="pl-8 border-primary/20 bg-primary/5 focus-visible:ring-primary w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] border-primary/20 bg-primary/5 focus-visible:ring-primary">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsAddAppointmentModalOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </div>

            <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
              <CardContent className="p-0">
                {isLoadingAppointments ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  </div>
                ) : filteredAppointments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No appointments found. Add your first appointment or adjust your filters.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell className="font-medium">{appointment.id}</TableCell>
                          <TableCell>{appointment.patientName}</TableCell>
                          <TableCell>{appointment.doctorName}</TableCell>
                          <TableCell>{appointment.department}</TableCell>
                          <TableCell>
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                appointment.status === "confirmed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800"
                                  : appointment.status === "completed"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800"
                                    : appointment.status === "cancelled"
                                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800"
                                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800"
                              }
                            >
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                onClick={() => {
                                  toast({
                                    title: "View Appointment",
                                    description: `Viewing details for appointment ${appointment.id}`,
                                  })
                                }}
                              >
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              {appointment.status === "pending" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-green-100 hover:text-green-800"
                                    onClick={() => {
                                      const updatedAppointments = appointments.map((a) =>
                                        a.id === appointment.id ? { ...a, status: "confirmed" } : a,
                                      )
                                      setAppointments(updatedAppointments)
                                      toast({
                                        title: "Appointment Confirmed",
                                        description: `Appointment ${appointment.id} has been confirmed.`,
                                      })
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="sr-only">Confirm</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-red-100 hover:text-red-800"
                                    onClick={() => {
                                      const updatedAppointments = appointments.map((a) =>
                                        a.id === appointment.id ? { ...a, status: "cancelled" } : a,
                                      )
                                      setAppointments(updatedAppointments)
                                      toast({
                                        title: "Appointment Cancelled",
                                        description: `Appointment ${appointment.id} has been cancelled.`,
                                      })
                                    }}
                                  >
                                    <XCircle className="h-4 w-4" />
                                    <span className="sr-only">Cancel</span>
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ambulances" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] border-primary/20 bg-primary/5 focus-visible:ring-primary">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="on_call">On Call</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsAddAmbulanceModalOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Ambulance
              </Button>
            </div>

            <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
              <CardContent className="p-0">
                {isLoadingAmbulances ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  </div>
                ) : filteredAmbulances.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No ambulances found. Add your first ambulance or adjust your filters.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Vehicle Number</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Last Service</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAmbulances.map((ambulance) => (
                        <TableRow key={ambulance.id}>
                          <TableCell className="font-medium">{ambulance.id}</TableCell>
                          <TableCell>{ambulance.driverName}</TableCell>
                          <TableCell>{ambulance.vehicleNumber}</TableCell>
                          <TableCell>{ambulance.location}</TableCell>
                          <TableCell>{new Date(ambulance.lastService).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                ambulance.status === "available"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800"
                                  : ambulance.status === "on_call"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800"
                              }
                            >
                              {ambulance.status === "available"
                                ? "Available"
                                : ambulance.status === "on_call"
                                  ? "On Call"
                                  : "Maintenance"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                onClick={() => {
                                  toast({
                                    title: "View Ambulance",
                                    description: `Viewing details for ambulance ${ambulance.id}`,
                                  })
                                }}
                              >
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-yellow-100 hover:text-yellow-800"
                                onClick={() => {
                                  // Cycle through statuses: available -> on_call -> maintenance -> available
                                  const newStatus =
                                    ambulance.status === "available"
                                      ? "on_call"
                                      : ambulance.status === "on_call"
                                        ? "maintenance"
                                        : "available"

                                  // Update ambulance status in the database
                                  updateAmbulanceStatus(ambulance.id, newStatus)

                                  // Update local state
                                  const updatedAmbulances = ambulances.map((a) =>
                                    a.id === ambulance.id ? { ...a, status: newStatus } : a,
                                  )
                                  setAmbulances(updatedAmbulances)

                                  toast({
                                    title: "Status Updated",
                                    description: `Ambulance ${ambulance.id} status changed to ${newStatus.replace("_", " ")}.`,
                                  })
                                }}
                              >
                                {ambulance.status === "available" ? (
                                  <Ambulance className="h-4 w-4" />
                                ) : ambulance.status === "on_call" ? (
                                  <AlertTriangle className="h-4 w-4" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                                <span className="sr-only">Change Status</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-red-100 hover:text-red-800"
                                onClick={() => {
                                  // Call function to remove ambulance
                                  removeAmbulance(ambulance.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Add the modals */}
      <AddAmbulanceModal
        isOpen={isAddAmbulanceModalOpen}
        onClose={() => setIsAddAmbulanceModalOpen(false)}
        onAddAmbulance={handleAddAmbulance}
      />

      <AddAppointmentModal
        isOpen={isAddAppointmentModalOpen}
        onClose={() => setIsAddAppointmentModalOpen(false)}
        onAddAppointment={handleAddAppointment}
      />

      <AddEmergencyModal
        isOpen={isAddEmergencyModalOpen}
        onClose={() => setIsAddEmergencyModalOpen(false)}
        onAddEmergency={handleAddEmergency}
        availableAmbulances={availableAmbulances}
      />
    </div>
  )
}

