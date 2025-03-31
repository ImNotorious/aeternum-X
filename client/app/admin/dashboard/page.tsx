"use client"

import { useState } from "react"
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
  Clock,
  AlertTriangle,
} from "lucide-react"
import { AddAmbulanceModal } from "@/components/admin/add-ambulance-modal"
import { AddAppointmentModal } from "@/components/admin/add-appointment-modal"
import { AddEmergencyModal } from "@/components/admin/add-emergency-modal"

// Define the structure for Ambulance
interface Ambulance {
  id: string;
  driverName: string;
  vehicleNumber: string;
  status: string; // e.g., "available", "on_call", "maintenance"
  location: string;
  lastService: string;
}

// Define the structure for Appointment
interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: string; // e.g., "confirmed", "completed", "cancelled", "pending"
  department: string;
}

// Define the structure for Emergency Call
interface Emergency {
  id: string;
  patientName: string;
  contactNumber: string;
  location: string;
  emergencyType: string; // e.g., "Cardiac", "Accident"
  status: string; // e.g., "dispatched", "in_progress", "completed"
  ambulanceId?: string; // Optional, as not all emergencies may have an ambulance assigned
  timestamp: string;
}


// Mock data for dashboard
const APPOINTMENTS_DATA = [
  {
    id: "APT-1234",
    patientName: "Rahul Sharma",
    doctorName: "Dr. Sarah Johnson",
    date: "2023-05-15",
    time: "10:00 AM",
    status: "confirmed",
    department: "Cardiology",
  },
  {
    id: "APT-1235",
    patientName: "Priya Patel",
    doctorName: "Dr. Michael Chen",
    date: "2023-05-15",
    time: "11:30 AM",
    status: "completed",
    department: "Neurology",
  },
  {
    id: "APT-1236",
    patientName: "Amit Kumar",
    doctorName: "Dr. Emily Rodriguez",
    date: "2023-05-15",
    time: "2:00 PM",
    status: "cancelled",
    department: "Dermatology",
  },
  {
    id: "APT-1237",
    patientName: "Neha Singh",
    doctorName: "Dr. James Wilson",
    date: "2023-05-16",
    time: "9:30 AM",
    status: "confirmed",
    department: "Orthopedics",
  },
  {
    id: "APT-1238",
    patientName: "Vikram Mehta",
    doctorName: "Dr. Sarah Johnson",
    date: "2023-05-16",
    time: "3:00 PM",
    status: "pending",
    department: "Cardiology",
  },
]

const AMBULANCE_DATA = [
  {
    id: "AMB-1001",
    driverName: "Rajesh Kumar",
    vehicleNumber: "DL 01 AB 1234",
    status: "available",
    location: "North Delhi",
    lastService: "2023-04-28",
  },
  {
    id: "AMB-1002",
    driverName: "Suresh Yadav",
    vehicleNumber: "DL 01 CD 5678",
    status: "on_call",
    location: "South Delhi",
    lastService: "2023-05-05",
  },
  {
    id: "AMB-1003",
    driverName: "Mahesh Singh",
    vehicleNumber: "DL 01 EF 9012",
    status: "maintenance",
    location: "Workshop",
    lastService: "2023-05-12",
  },
  {
    id: "AMB-1004",
    driverName: "Dinesh Gupta",
    vehicleNumber: "DL 01 GH 3456",
    status: "available",
    location: "East Delhi",
    lastService: "2023-04-15",
  },
  {
    id: "AMB-1005",
    driverName: "Ramesh Verma",
    vehicleNumber: "DL 01 IJ 7890",
    status: "on_call",
    location: "West Delhi",
    lastService: "2023-05-01",
  },
]

const EMERGENCY_CALLS = [
  {
    id: "CALL-2001",
    patientName: "Ananya Reddy",
    contactNumber: "+91 98765 43210",
    location: "Connaught Place, New Delhi",
    emergencyType: "Cardiac",
    status: "dispatched",
    ambulanceId: "AMB-1002",
    timestamp: "2023-05-15T10:15:00",
  },
  {
    id: "CALL-2002",
    patientName: "Ravi Malhotra",
    contactNumber: "+91 87654 32109",
    location: "Lajpat Nagar, New Delhi",
    emergencyType: "Accident",
    status: "completed",
    ambulanceId: "AMB-1005",
    timestamp: "2023-05-15T09:30:00",
  },
  {
    id: "CALL-2003",
    patientName: "Sanjay Kapoor",
    contactNumber: "+91 76543 21098",
    location: "Rohini, New Delhi",
    emergencyType: "Respiratory",
    status: "in_progress",
    ambulanceId: "AMB-1002",
    timestamp: "2023-05-15T11:45:00",
  },
]

export default function AdminDashboardPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [appointments, setAppointments] = useState(APPOINTMENTS_DATA)
  const [ambulances, setAmbulances] = useState(AMBULANCE_DATA)
  const [emergencyCalls, setEmergencyCalls] = useState(EMERGENCY_CALLS)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Add state for modals
  const [isAddAmbulanceModalOpen, setIsAddAmbulanceModalOpen] = useState(false)
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] = useState(false)
  const [isAddEmergencyModalOpen, setIsAddEmergencyModalOpen] = useState(false)

  // Add handlers for adding new items
  // Function to handle adding a new ambulance
const handleAddAmbulance = (newAmbulance: Ambulance) => {
  setAmbulances((prev) => [newAmbulance, ...prev]);
};

// Function to handle adding a new appointment
const handleAddAppointment = (newAppointment: Appointment) => {
  setAppointments((prev) => [newAppointment, ...prev]);
};

// Function to handle adding a new emergency call
const handleAddEmergency = (newEmergency: Emergency) => {
  setEmergencyCalls((prev) => [
    {
      ...newEmergency,
      ambulanceId: newEmergency.ambulanceId ?? "", // Provide a default empty string if undefined
    },
    ...prev,
  ]);

  // Update ambulance status to "on_call"
  if (newEmergency.ambulanceId) {
    setAmbulances((prev) =>
      prev.map((ambulance) =>
        ambulance.id === newEmergency.ambulanceId ? { ...ambulance, status: "on_call" } : ambulance
      )
    );
  }
};



  // Filter appointments based on search query and status
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.id.toLowerCase().includes(searchQuery.toLowerCase())

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
    totalRevenue: "₹45,250",
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
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Emergency Calls</CardTitle>
                <CardDescription>Active and recent emergency calls</CardDescription>
              </CardHeader>
              <CardContent>
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
                          {ambulance.status !== "maintenance" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-yellow-100 hover:text-yellow-800"
                              onClick={() => {
                                const updatedAmbulances = ambulances.map((a) =>
                                  a.id === ambulance.id ? { ...a, status: "maintenance" } : a,
                                )
                                setAmbulances(updatedAmbulances)
                                toast({
                                  title: "Maintenance Scheduled",
                                  description: `Ambulance ${ambulance.id} has been scheduled for maintenance.`,
                                })
                              }}
                            >
                              <AlertTriangle className="h-4 w-4" />
                              <span className="sr-only">Maintenance</span>
                            </Button>
                          )}
                          {ambulance.status === "maintenance" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-green-100 hover:text-green-800"
                              onClick={() => {
                                const updatedAmbulances = ambulances.map((a) =>
                                  a.id === ambulance.id ? { ...a, status: "available" } : a,
                                )
                                setAmbulances(updatedAmbulances)
                                toast({
                                  title: "Maintenance Completed",
                                  description: `Ambulance ${ambulance.id} is now available.`,
                                })
                              }}
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span className="sr-only">Available</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          <div className="grid gap-6">
            <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Active Emergency Calls</CardTitle>
                  <CardDescription>Real-time tracking of emergency situations</CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsAddEmergencyModalOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Emergency
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Emergency Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Ambulance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emergencyCalls.map((call) => (
                      <TableRow key={call.id}>
                        <TableCell className="font-medium">{call.id}</TableCell>
                        <TableCell>{call.patientName}</TableCell>
                        <TableCell>{call.emergencyType}</TableCell>
                        <TableCell className="truncate max-w-[150px]">{call.location}</TableCell>
                        <TableCell>{call.ambulanceId}</TableCell>
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
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{new Date(call.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                              onClick={() => {
                                toast({
                                  title: "View Emergency Call",
                                  description: `Viewing details for emergency call ${call.id}`,
                                })
                              }}
                            >
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            {call.status !== "completed" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-green-100 hover:text-green-800"
                                onClick={() => {
                                  const updatedCalls = emergencyCalls.map((c) =>
                                    c.id === call.id ? { ...c, status: "completed" } : c,
                                  )
                                  setEmergencyCalls(updatedCalls)

                                  // Update ambulance status
                                  const updatedAmbulances = ambulances.map((a) =>
                                    a.id === call.ambulanceId ? { ...a, status: "available" } : a,
                                  )
                                  setAmbulances(updatedAmbulances)

                                  toast({
                                    title: "Emergency Call Completed",
                                    description: `Emergency call ${call.id} has been marked as completed.`,
                                  })
                                }}
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span className="sr-only">Complete</span>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

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

