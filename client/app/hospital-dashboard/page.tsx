"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import {
  Ambulance,
  BedDouble,
  Clock,
  Activity,
  Search,
  PlusCircle,
  FileText,
  CheckCircle,
  Stethoscope,
  Building2,
  ArrowRight,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

// Mock data for hospital dashboard
const EMERGENCY_REQUESTS = [
  {
    id: "ER-1001",
    patientName: "Ananya Reddy",
    contactNumber: "+91 98765 43210",
    location: "Connaught Place, New Delhi",
    emergencyType: "Cardiac",
    status: "pending",
    priority: "critical",
    timestamp: "2023-05-15T10:15:00",
  },
  {
    id: "ER-1002",
    patientName: "Ravi Malhotra",
    contactNumber: "+91 87654 32109",
    location: "Lajpat Nagar, New Delhi",
    emergencyType: "Accident",
    status: "dispatched",
    priority: "high",
    timestamp: "2023-05-15T09:30:00",
  },
  {
    id: "ER-1003",
    patientName: "Sanjay Kapoor",
    contactNumber: "+91 76543 21098",
    location: "Rohini, New Delhi",
    emergencyType: "Respiratory",
    status: "pending",
    priority: "high",
    timestamp: "2023-05-15T11:45:00",
  },
  {
    id: "ER-1004",
    patientName: "Meera Singh",
    contactNumber: "+91 65432 10987",
    location: "Dwarka, New Delhi",
    emergencyType: "Stroke",
    status: "pending",
    priority: "critical",
    timestamp: "2023-05-15T12:30:00",
  },
]

const BED_DATA = [
  {
    id: "WARD-GEN",
    name: "General Ward",
    total: 50,
    occupied: 38,
    available: 12,
    reserved: 5,
    maintenance: 0,
  },
  {
    id: "WARD-PVT",
    name: "Private Rooms",
    total: 20,
    occupied: 15,
    available: 5,
    reserved: 2,
    maintenance: 0,
  },
  {
    id: "ICU",
    name: "Intensive Care Unit",
    total: 15,
    occupied: 12,
    available: 3,
    reserved: 1,
    maintenance: 0,
  },
  {
    id: "CCU",
    name: "Cardiac Care Unit",
    total: 10,
    occupied: 7,
    available: 3,
    reserved: 1,
    maintenance: 0,
  },
  {
    id: "NICU",
    name: "Neonatal ICU",
    total: 8,
    occupied: 5,
    available: 3,
    reserved: 0,
    maintenance: 0,
  },
]

const RECENT_ADMISSIONS = [
  {
    id: "ADM-5001",
    patientName: "Vikram Mehta",
    age: 45,
    gender: "Male",
    admissionDate: "2023-05-15T08:30:00",
    department: "Cardiology",
    doctor: "Dr. Sarah Johnson",
    bedId: "ICU-05",
  },
  {
    id: "ADM-5002",
    patientName: "Neha Singh",
    age: 32,
    gender: "Female",
    admissionDate: "2023-05-15T09:15:00",
    department: "Orthopedics",
    doctor: "Dr. James Wilson",
    bedId: "WARD-GEN-22",
  },
  {
    id: "ADM-5003",
    patientName: "Rahul Sharma",
    age: 28,
    gender: "Male",
    admissionDate: "2023-05-15T10:45:00",
    department: "Neurology",
    doctor: "Dr. Michael Chen",
    bedId: "WARD-PVT-08",
  },
]

const DEPARTMENT_STATUS = [
  {
    id: "DEPT-CARD",
    name: "Cardiology",
    doctors: 8,
    doctorsPresent: 6,
    patients: 24,
    criticalCases: 5,
  },
  {
    id: "DEPT-ORTH",
    name: "Orthopedics",
    doctors: 6,
    doctorsPresent: 4,
    patients: 18,
    criticalCases: 2,
  },
  {
    id: "DEPT-NEUR",
    name: "Neurology",
    doctors: 5,
    doctorsPresent: 3,
    patients: 15,
    criticalCases: 4,
  },
  {
    id: "DEPT-PEDI",
    name: "Pediatrics",
    doctors: 7,
    doctorsPresent: 5,
    patients: 22,
    criticalCases: 3,
  },
]

export default function HospitalDashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [emergencyRequests, setEmergencyRequests] = useState(EMERGENCY_REQUESTS)
  const [bedData, setBedData] = useState(BED_DATA)
  const [recentAdmissions, setRecentAdmissions] = useState(RECENT_ADMISSIONS)
  const [departmentStatus, setDepartmentStatus] = useState(DEPARTMENT_STATUS)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user || user.role !== "hospital") {
      router.push("/auth/hospital-login")
    }
  }, [user, router])

  // Filter emergency requests based on search query and status
  const filteredEmergencyRequests = emergencyRequests.filter((request) => {
    const matchesSearch =
      request.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.emergencyType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Calculate overall bed statistics
  const bedStats = {
    total: bedData.reduce((sum, ward) => sum + ward.total, 0),
    occupied: bedData.reduce((sum, ward) => sum + ward.occupied, 0),
    available: bedData.reduce((sum, ward) => sum + ward.available, 0),
    occupancyRate: Math.round(
      (bedData.reduce((sum, ward) => sum + ward.occupied, 0) / bedData.reduce((sum, ward) => sum + ward.total, 0)) *
        100,
    ),
  }

  // Handle emergency request dispatch
  const handleDispatchAmbulance = (requestId) => {
    const updatedRequests = emergencyRequests.map((request) =>
      request.id === requestId ? { ...request, status: "dispatched" } : request,
    )
    setEmergencyRequests(updatedRequests)
    toast({
      title: "Ambulance Dispatched",
      description: `Ambulance has been dispatched for emergency request ${requestId}`,
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
          Hospital Dashboard
        </h1>
        <p className="text-muted-foreground">Monitor emergency requests, bed availability, and hospital operations</p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-primary/10 p-1">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Building2 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="emergency"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Ambulance className="h-4 w-4 mr-2" />
            Emergency Requests
          </TabsTrigger>
          <TabsTrigger
            value="beds"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <BedDouble className="h-4 w-4 mr-2" />
            Bed Management
          </TabsTrigger>
          <TabsTrigger
            value="departments"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Stethoscope className="h-4 w-4 mr-2" />
            Departments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Emergency Requests</CardTitle>
                <Ambulance className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emergencyRequests.length}</div>
                <p className="text-xs text-muted-foreground">
                  {emergencyRequests.filter((r) => r.status === "pending").length} pending requests
                </p>
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-primary/20 bg-primary/5 hover:bg-primary/10"
                    onClick={() => setActiveTab("emergency")}
                  >
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Bed Availability</CardTitle>
                <BedDouble className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bedStats.available} / {bedStats.total}
                </div>
                <p className="text-xs text-muted-foreground">{bedStats.occupancyRate}% occupancy rate</p>
                <div className="mt-3">
                  <Progress value={bedStats.occupancyRate} className="h-2" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Departments</CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{departmentStatus.length}</div>
                <p className="text-xs text-muted-foreground">
                  {departmentStatus.reduce((sum, dept) => sum + dept.doctorsPresent, 0)} doctors present
                </p>
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-primary/20 bg-primary/5 hover:bg-primary/10"
                    onClick={() => setActiveTab("departments")}
                  >
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {departmentStatus.reduce((sum, dept) => sum + dept.criticalCases, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {emergencyRequests.filter((r) => r.priority === "critical" && r.status === "pending").length} critical
                  emergencies pending
                </p>
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-primary/20 bg-primary/5 hover:bg-primary/10"
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Recent Admissions</CardTitle>
                <CardDescription>Latest patient admissions across all departments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Bed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAdmissions.map((admission) => (
                      <TableRow key={admission.id}>
                        <TableCell className="font-medium">
                          {admission.patientName}
                          <div className="text-xs text-muted-foreground">
                            {admission.age} yrs, {admission.gender}
                          </div>
                        </TableCell>
                        <TableCell>{admission.department}</TableCell>
                        <TableCell>{admission.doctor}</TableCell>
                        <TableCell>{admission.bedId}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Pending Emergency Requests</CardTitle>
                <CardDescription>Urgent requests requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emergencyRequests
                      .filter((request) => request.status === "pending")
                      .slice(0, 3)
                      .map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            {request.patientName}
                            <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {request.location}
                            </div>
                          </TableCell>
                          <TableCell>{request.emergencyType}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                request.priority === "critical"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800"
                              }
                            >
                              {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-primary/20 bg-primary/5 hover:bg-primary/10"
                              onClick={() => handleDispatchAmbulance(request.id)}
                            >
                              Dispatch
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search emergency requests..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="dispatched">Dispatched</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Emergency Request
            </Button>
          </div>

          <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Emergency Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmergencyRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>
                        {request.patientName}
                        <div className="text-xs text-muted-foreground">{request.contactNumber}</div>
                      </TableCell>
                      <TableCell>{request.emergencyType}</TableCell>
                      <TableCell className="truncate max-w-[150px]">{request.location}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            request.priority === "critical"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800"
                              : request.priority === "high"
                                ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-200 dark:border-orange-800"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800"
                          }
                        >
                          {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            request.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800"
                              : request.status === "dispatched"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800"
                          }
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{new Date(request.timestamp).toLocaleTimeString()}</span>
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
                                title: "View Request",
                                description: `Viewing details for emergency request ${request.id}`,
                              })
                            }}
                          >
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          {request.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-green-100 hover:text-green-800"
                              onClick={() => handleDispatchAmbulance(request.id)}
                            >
                              <Ambulance className="h-4 w-4" />
                              <span className="sr-only">Dispatch</span>
                            </Button>
                          )}
                          {request.status === "dispatched" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-green-100 hover:text-green-800"
                              onClick={() => {
                                const updatedRequests = emergencyRequests.map((r) =>
                                  r.id === request.id ? { ...r, status: "completed" } : r,
                                )
                                setEmergencyRequests(updatedRequests)
                                toast({
                                  title: "Request Completed",
                                  description: `Emergency request ${request.id} has been marked as completed.`,
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
        </TabsContent>

        <TabsContent value="beds" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm">Reserved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                <span className="text-sm">Maintenance</span>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Bed
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bedData.map((ward) => (
              <Card
                key={ward.id}
                className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{ward.name}</CardTitle>
                  <CardDescription>
                    {ward.available} of {ward.total} beds available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Occupancy Rate</span>
                      <span className="font-medium">{Math.round((ward.occupied / ward.total) * 100)}%</span>
                    </div>
                    <Progress value={Math.round((ward.occupied / ward.total) * 100)} className="h-2" />

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="flex flex-col items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 p-3">
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">{ward.available}</span>
                        <span className="text-xs text-green-600 dark:text-green-400">Available</span>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30 p-3">
                        <span className="text-2xl font-bold text-red-600 dark:text-red-400">{ward.occupied}</span>
                        <span className="text-xs text-red-600 dark:text-red-400">Occupied</span>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30 p-3">
                        <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{ward.reserved}</span>
                        <span className="text-xs text-yellow-600 dark:text-yellow-400">Reserved</span>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 p-3">
                        <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">{ward.maintenance}</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Maintenance</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-primary/20 bg-primary/5 hover:bg-primary/10"
                      onClick={() => {
                        toast({
                          title: "View Ward Details",
                          description: `Viewing detailed bed allocation for ${ward.name}`,
                        })
                      }}
                    >
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Bed Allocation Summary</CardTitle>
              <CardDescription>Overall hospital bed status and recent changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Beds</span>
                  <span className="font-bold">{bedStats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Occupied Beds</span>
                  <span className="font-bold">{bedStats.occupied}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Available Beds</span>
                  <span className="font-bold text-green-600 dark:text-green-400">{bedStats.available}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Reserved Beds</span>
                  <span className="font-bold">{bedData.reduce((sum, ward) => sum + ward.reserved, 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Maintenance</span>
                  <span className="font-bold">{bedData.reduce((sum, ward) => sum + ward.maintenance, 0)}</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Occupancy Rate</span>
                    <span className="font-medium">{bedStats.occupancyRate}%</span>
                  </div>
                  <Progress value={bedStats.occupancyRate} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {departmentStatus.map((department) => (
              <Card
                key={department.id}
                className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{department.name}</CardTitle>
                      <CardDescription>
                        {department.doctorsPresent} of {department.doctors} doctors present
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        department.criticalCases > 3
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800"
                          : department.criticalCases > 1
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800"
                      }
                    >
                      {department.criticalCases} Critical Cases
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Total Patients</div>
                        <div className="text-2xl font-bold">{department.patients}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Doctor Availability</div>
                        <div className="text-2xl font-bold">
                          {Math.round((department.doctorsPresent / department.doctors) * 100)}%
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Department Load</span>
                        <span className="font-medium">
                          {Math.round((department.patients / (department.doctorsPresent * 5)) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={Math.round((department.patients / (department.doctorsPresent * 5)) * 100)}
                        className="h-2"
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-primary/20 bg-primary/5 hover:bg-primary/10"
                        onClick={() => {
                          toast({
                            title: "View Department",
                            description: `Viewing detailed information for ${department.name} department`,
                          })
                        }}
                      >
                        View Department
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Department Staff Schedule</CardTitle>
              <CardDescription>Today's doctor and nurse availability</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Morning Shift</TableHead>
                    <TableHead>Afternoon Shift</TableHead>
                    <TableHead>Night Shift</TableHead>
                    <TableHead>On Call</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentStatus.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell className="font-medium">{department.name}</TableCell>
                      <TableCell>
                        {Math.floor(department.doctorsPresent / 3)} Doctors, {Math.floor(department.patients / 5)}{" "}
                        Nurses
                      </TableCell>
                      <TableCell>
                        {Math.ceil(department.doctorsPresent / 3)} Doctors, {Math.ceil(department.patients / 5)} Nurses
                      </TableCell>
                      <TableCell>
                        {Math.floor(department.doctorsPresent / 4)} Doctors, {Math.floor(department.patients / 6)}{" "}
                        Nurses
                      </TableCell>
                      <TableCell>{Math.max(1, Math.floor(department.doctorsPresent / 5))} Doctors</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

