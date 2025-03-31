"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, MessageSquare } from "lucide-react"
import { GlowingButton } from "@/components/ui/glowing-button"

export default function DashboardAppointments() {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "2023-04-15",
      time: "10:00 AM",
      status: "upcoming",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Neurologist",
      date: "2023-04-18",
      time: "2:30 PM",
      status: "upcoming",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      doctor: "Dr. Emily Rodriguez",
      specialty: "Dermatologist",
      date: "2023-04-10",
      time: "11:15 AM",
      status: "completed",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      doctor: "Dr. James Wilson",
      specialty: "Orthopedic Surgeon",
      date: "2023-04-05",
      time: "9:00 AM",
      status: "completed",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Appointments</h3>
        <GlowingButton>
          <Calendar className="mr-2 h-4 w-4" />
          Book New
        </GlowingButton>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {appointments.map((appointment, index) => (
          <motion.div
            key={appointment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/10 hover:border-primary/50">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={appointment.avatar} alt={appointment.doctor} />
                      <AvatarFallback>
                        {appointment.doctor
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{appointment.doctor}</CardTitle>
                      <CardDescription>{appointment.specialty}</CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={appointment.status === "upcoming" ? "default" : "secondary"}
                    className={appointment.status === "upcoming" ? "bg-primary/20 text-primary border-primary/20" : ""}
                  >
                    {appointment.status === "upcoming" ? "Upcoming" : "Completed"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.time}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                {appointment.status === "upcoming" ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-primary/20 bg-primary/5 hover:bg-primary/10"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                    <GlowingButton size="sm" className="w-full">
                      <Video className="mr-2 h-4 w-4" />
                      Join Call
                    </GlowingButton>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-primary/20 bg-primary/5 hover:bg-primary/10"
                  >
                    View Summary
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

