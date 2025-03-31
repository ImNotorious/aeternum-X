"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, FileText, Phone, Mail, Calendar, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PatientsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")

  // Mock patient data
  const [patients, setPatients] = useState([
    {
      id: "P-1001",
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 43210",
      dateOfBirth: "1985-05-15",
      gender: "Male",
      bloodGroup: "O+",
      lastVisit: "2023-04-10",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "P-1002",
      name: "Priya Patel",
      email: "priya.patel@example.com",
      phone: "+91 87654 32109",
      dateOfBirth: "1990-08-22",
      gender: "Female",
      bloodGroup: "A+",
      lastVisit: "2023-04-05",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "P-1003",
      name: "Amit Kumar",
      email: "amit.kumar@example.com",
      phone: "+91 76543 21098",
      dateOfBirth: "1978-12-03",
      gender: "Male",
      bloodGroup: "B-",
      lastVisit: "2023-03-28",
      status: "inactive",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "P-1004",
      name: "Neha Singh",
      email: "neha.singh@example.com",
      phone: "+91 65432 10987",
      dateOfBirth: "1992-02-14",
      gender: "Female",
      bloodGroup: "AB+",
      lastVisit: "2023-04-12",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "P-1005",
      name: "Vikram Mehta",
      email: "vikram.mehta@example.com",
      phone: "+91 54321 09876",
      dateOfBirth: "1965-07-30",
      gender: "Male",
      bloodGroup: "O-",
      lastVisit: "2023-03-15",
      status: "critical",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])

  // Filter patients based on search query
  const filteredPatients = patients.filter((patient) => {
    return (
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery)
    )
  })

  const handleViewPatient = (patientId: string) => {
    toast({
      title: "Patient Details",
      description: `Viewing details for patient ${patientId}`,
    })
  }

  const handleContactPatient = (patientId: string, method: "email" | "phone") => {
    toast({
      title: `Contact Patient`,
      description: `Contacting patient ${patientId} via ${method}`,
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
          Patient Management
        </h1>
        <p className="text-muted-foreground">View and manage patient records</p>
      </motion.div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search patients..."
            className="pl-10 border-primary/20 bg-primary/5 focus-visible:ring-primary w-full md:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-primary/20 bg-primary/5 hover:bg-primary/10">
            Export List
          </Button>
          <Button className="bg-primary hover:bg-primary/90">Add New Patient</Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Patient Records</CardTitle>
            <CardDescription>
              {filteredPatients.length} {filteredPatients.length === 1 ? "patient" : "patients"} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient, index) => (
                  <motion.tr
                    key={patient.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-primary/5"
                  >
                    <TableCell className="font-medium">{patient.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={patient.avatar} alt={patient.name} />
                          <AvatarFallback>
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {patient.gender}, {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}{" "}
                            yrs
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-xs">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="truncate max-w-[150px]">{patient.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{patient.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/5 border-primary/20">
                        {patient.bloodGroup}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(patient.lastVisit).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          patient.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800"
                            : patient.status === "inactive"
                              ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-800"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800"
                        }
                      >
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleViewPatient(patient.id)}
                        >
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleContactPatient(patient.id, "email")}
                        >
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Email</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleContactPatient(patient.id, "phone")}
                        >
                          <Phone className="h-4 w-4" />
                          <span className="sr-only">Call</span>
                        </Button>
                        {patient.status === "critical" && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-100 hover:text-red-800">
                            <AlertCircle className="h-4 w-4" />
                            <span className="sr-only">Alert</span>
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

