"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Upload, Lock, Eye } from "lucide-react"
import { GlowingButton } from "@/components/ui/glowing-button"

export default function DashboardMedicalRecords() {
  const [records, setRecords] = useState([
    {
      id: "REC-001",
      date: "2023-04-10",
      type: "Prescription",
      doctor: "Dr. Sarah Johnson",
      description: "Medication for hypertension",
      encrypted: true,
    },
    {
      id: "REC-002",
      date: "2023-04-05",
      type: "Lab Results",
      doctor: "Dr. Michael Chen",
      description: "Blood test results",
      encrypted: true,
    },
    {
      id: "REC-003",
      date: "2023-03-28",
      type: "Imaging",
      doctor: "Dr. Emily Rodriguez",
      description: "MRI scan of left knee",
      encrypted: true,
    },
    {
      id: "REC-004",
      date: "2023-03-15",
      type: "Clinical Notes",
      doctor: "Dr. James Wilson",
      description: "Follow-up consultation notes",
      encrypted: true,
    },
  ])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Medical Records</h3>
        <GlowingButton>
          <Upload className="mr-2 h-4 w-4" />
          Upload Record
        </GlowingButton>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Your Medical Records</CardTitle>
            <CardDescription>All records are encrypted and stored securely </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Security</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record, index) => (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-primary/5"
                  >
                    <TableCell className="font-medium">{record.id}</TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-primary/20 bg-primary/5">
                        {record.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.doctor}</TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell>
                      {record.encrypted ? (
                        <div className="flex items-center gap-1 text-xs">
                          <Lock className="h-3 w-3 text-green-600" />
                          <span className="text-green-600 dark:text-green-400">Encrypted</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs">
                          <span>Standard</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
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

