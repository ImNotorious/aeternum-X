"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Calendar, CheckCircle, XCircle, FileText } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function AdminAppointmentsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock appointment data
  const [appointments, setAppointments] = useState([
    {
      id: "APT-1234",
      patientName: "Rahul Sharma",
      patientId: "P-1001",
      doctorName: "Dr. Sarah Johnson",
      date: "2023-05-15",
      time: "10:00 AM",
      status: "confirmed",
      department: "Cardiology",
    },
    {
      id: "APT-1235",
      patientName: "Priya Patel",
      patientId: "P-1002",
      doctorName: "Dr. Michael Chen",
      date: "2023-05-15",
      time: "11:30 AM",
      status: "completed",
      department: "Neurology",
    },
    {
      id: "APT-1236",
      patientName: "Amit Kumar",
      patientId: "P-1003",
      doctorName: "Dr. Emily Rodriguez",
      date: "2023-05-15",
      time: "2:00 PM",
      status: "cancelled",
      department: "Dermatology",
    },
    {
      id: "APT-1237",
      patientName: "Neha Singh",
      patientId: "P-1004",
      doctorName: "Dr. James Wilson",
      date: "2023-05-16",
      time: "9:30 AM",
      status: "confirmed",
      department: "Orthopedics",
    },
    {
      id: "APT-1238",
      patientName: "Vikram Mehta",
      patientId: "P-1005",
      doctorName: "Dr. Sarah Johnson",
      date: "2023-05-16",
      time: "3:00 PM",
      status: "pending",
      department: "Cardiology",
    },
  ])

  // Filter appointments based on search query and status
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment,
    )
    setAppointments(updatedAppointments)

    toast({
      title: "Appointment Updated",
      description: `Appointment ${appointmentId} status changed to ${newStatus}.`,
    })
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
          Appointment Management
        </h1>
        <p className="text-muted-foreground">View and manage hospital appointments</p>
      </motion.div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search appointments..."
              className="pl-10 border-primary/20 bg-primary/5 focus-visible:ring-primary w-full md:w-[250px]"
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
        <Button className="bg-primary hover:bg-primary/90">Schedule New Appointment</Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Appointment Schedule</CardTitle>
            <CardDescription>
              {filteredAppointments.length} {filteredAppointments.length === 1 ? "appointment" : "appointments"} found
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                {filteredAppointments.map((appointment, index) => (
                  <motion.tr
                    key={appointment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-primary/5"
                  >
                    <TableCell className="font-medium">{appointment.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{appointment.patientName}</span>
                        <span className="text-xs text-muted-foreground">{appointment.patientId}</span>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.doctorName}</TableCell>
                    <TableCell>{appointment.department}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </span>
                      </div>
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
                              onClick={() => handleStatusChange(appointment.id, "confirmed")}
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span className="sr-only">Confirm</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-red-100 hover:text-red-800"
                              onClick={() => handleStatusChange(appointment.id, "cancelled")}
                            >
                              <XCircle className="h-4 w-4" />
                              <span className="sr-only">Cancel</span>
                            </Button>
                          </>
                        )}
                        {appointment.status === "confirmed" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-100 hover:text-blue-800"
                            onClick={() => handleStatusChange(appointment.id, "completed")}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">Complete</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

