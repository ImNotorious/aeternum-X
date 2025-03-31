"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminEmergencyPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")

  // Mock emergency calls data
  const [emergencyCalls, setEmergencyCalls] = useState([
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
    {
      id: "CALL-2004",
      patientName: "Meera Verma",
      contactNumber: "+91 65432 10987",
      location: "Dwarka, New Delhi",
      emergencyType: "Stroke",
      status: "pending",
      ambulanceId: null,
      timestamp: "2023-05-15T12:30:00",
    },
    {
      id: "CALL-2005",
      patientName: "Arjun Singh",
      contactNumber: "+91 54321 09876",
      location: "Vasant Kunj, New Delhi",
      emergencyType: "Trauma",
      status: "dispatched",
      ambulanceId: "AMB-1003",
      timestamp: "2023-05-15T12:45:00",
    },
  ])

  // Mock ambulance data
  const [ambulances, setAmbulances] = useState([
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
      status: "on_call",
      location: "West Delhi",
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
      status: "maintenance",
      location: "Workshop",
      lastService: "2023-05-01",
    },
  ])

  // Filter emergency calls based on search query
  const filteredCalls = emergencyCalls.filter((call) => {
    return (
      call.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.emergencyType.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Get available ambulances
  const availableAmbulances = ambulances.filter((ambulance) => ambulance.status === "available")

  const handleDispatchAmbulance = (callId: string, ambulanceId: string) => {
    // Update emergency call
    const updatedCalls = emergencyCalls.map((call) =>
      call.id === callId ? { ...call, status: "dispatched", ambulanceId } : call,
    )
    setEmergencyCalls(updatedCalls)

    // Update ambulance status
    const updatedAmbulances = ambulances.map((ambulance) =>
      ambulance.id === ambulanceId ? { ...ambulance, status: "on_call" } : ambulance,
    )
    setAmbulances(updatedAmbulances)

    toast({
      title: "Ambulance Dispatched",
      description: `Ambulance ${ambulanceId} has been dispatched for emergency call ${callId}.`,
    })
  }

  const handleCompleteCall = (callId: string, ambulanceId: string | null) => {
    // Update emergency call
    const updatedCalls = emergencyCalls.map((call) => (call.id === callId ? { ...call, status: "completed" } : call))
    setEmergencyCalls(updatedCalls)

    // Update ambulance status if there is one assigned
    if (ambulanceId) {
      const updatedAmbulances = ambulances.map((ambulance) =>
        ambulance.id === ambulanceId ? { ...ambulance, status: "available" } : ambulance,
      )
      setAmbulances(updatedAmbulances)
    }

    toast({
      title: "Emergency Call Completed",
      description: `Emergency call ${callId} has been marked as completed.`,
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
          Emergency Management
        </h1>
        <p className="text-muted-foreground">Monitor and manage emergency calls and ambulance dispatch</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Emergencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {emergencyCalls.filter((call) => call.status !== "completed").length}
            </div>
            <p className="text-sm text-muted-foreground">
              {emergencyCalls.filter((call) => call.status === "pending").length} pending dispatch
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Available Ambulances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {ambulances.filter((ambulance) => ambulance.status === "available").length}
            </div>
            <p className="text-sm text-muted-foreground">
              {ambulances.filter((ambulance) => ambulance.status === "on_call").length} currently on call
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8.5 min</div>
            <p className="text-sm text-muted-foreground">Average response time today</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search emergency calls..."
            className="pl-10 border-primary/20 bg-primary/5 focus-visible:ring-primary w-full md:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="bg-primary hover:bg-primary/90">Register New Emergency</Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Emergency Calls</CardTitle>
            <CardDescription>
              {filteredCalls.length} {filteredCalls.length === 1 ? "call" : "calls"} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Emergency Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Ambulance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCalls.map((call, index) => (
                  <motion.tr
                    key={call.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-primary/5"
                  >
                    <TableCell className="font-medium">{call.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{call.patientName}</span>
                        <span className="text-xs text-muted-foreground">{call.contactNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/5 border-primary/20">
                        {call.emergencyType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate max-w-[150px]">{call.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(call.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {call.ambulanceId ? (
                        <span>{call.ambulanceId}</span>
                      ) : (
                        <span className="text-yellow-600 dark:text-yellow-400">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          call.status === "dispatched"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800"
                            : call.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800"
                              : call.status === "in_progress"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800"
                        }
                      >
                        {call.status === "dispatched"
                          ? "Dispatched"
                          : call.status === "in_progress"
                            ? "In Progress"
                            : call.status === "completed"
                              ? "Completed"
                              : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {call.status === "pending" && (
                          <select
                            className="h-8 rounded-md border border-primary/20 bg-primary/5 px-2 text-xs"
                            onChange={(e) => {
                              if (e.target.value) {
                                handleDispatchAmbulance(call.id, e.target.value)
                              }
                            }}
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Dispatch Ambulance
                            </option>
                            {availableAmbulances.map((ambulance) => (
                              <option key={ambulance.id} value={ambulance.id}>
                                {ambulance.id} - {ambulance.location}
                              </option>
                            ))}
                          </select>
                        )}

                        {(call.status === "dispatched" || call.status === "in_progress") && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-green-100 hover:text-green-800"
                            onClick={() => handleCompleteCall(call.id, call.ambulanceId)}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">Complete</span>
                          </Button>
                        )}

                        {call.status === "pending" && availableAmbulances.length === 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-yellow-100 hover:text-yellow-800"
                          >
                            <AlertTriangle className="h-4 w-4" />
                            <span className="sr-only">No Ambulances</span>
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

