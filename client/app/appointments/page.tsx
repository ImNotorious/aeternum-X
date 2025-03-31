"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, parseISO } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GlowingButton } from "@/components/ui/glowing-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

// Mock data for doctors
const DOCTORS = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    avatar: "/placeholder.svg?height=100&width=100",
    location: "Main Hospital, Floor 3",
    availableDays: [1, 2, 3, 4, 5], // Monday to Friday
    timeSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Neurologist",
    avatar: "/placeholder.svg?height=100&width=100",
    location: "North Wing, Floor 2",
    availableDays: [1, 3, 5], // Monday, Wednesday, Friday
    timeSlots: ["09:30", "10:30", "11:30", "14:30", "15:30"],
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialty: "Dermatologist",
    avatar: "/placeholder.svg?height=100&width=100",
    location: "Outpatient Clinic",
    availableDays: [2, 4], // Tuesday, Thursday
    timeSlots: ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00"],
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialty: "Orthopedic Surgeon",
    avatar: "/placeholder.svg?height=100&width=100",
    location: "Surgery Center, Floor 4",
    availableDays: [1, 2, 3, 4, 5], // Monday to Friday
    timeSlots: ["08:30", "09:30", "10:30", "13:30", "14:30", "15:30"],
  },
]

// Mock data for specialties
const SPECIALTIES = [
  { id: "all", name: "All Specialties" },
  { id: "cardiology", name: "Cardiology" },
  { id: "neurology", name: "Neurology" },
  { id: "dermatology", name: "Dermatology" },
  { id: "orthopedics", name: "Orthopedics" },
  { id: "pediatrics", name: "Pediatrics" },
  { id: "psychiatry", name: "Psychiatry" },
]

// Mock data for existing appointments
const MOCK_APPOINTMENTS = [
  {
    id: "apt1",
    doctorId: "1",
    date: "2023-05-15",
    time: "10:00",
    status: "confirmed",
  },
  {
    id: "apt2",
    doctorId: "2",
    date: "2023-05-18",
    time: "14:30",
    status: "confirmed",
  },
]

export default function AppointmentsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("book")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [filteredDoctors, setFilteredDoctors] = useState(DOCTORS)
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  // Filter doctors based on selected specialty
  useEffect(() => {
    if (selectedSpecialty === "all") {
      setFilteredDoctors(DOCTORS)
    } else {
      const filtered = DOCTORS.filter((doctor) => {
        if (selectedSpecialty === "cardiology" && doctor.specialty === "Cardiologist") return true
        if (selectedSpecialty === "neurology" && doctor.specialty === "Neurologist") return true
        if (selectedSpecialty === "dermatology" && doctor.specialty === "Dermatologist") return true
        if (selectedSpecialty === "orthopedics" && doctor.specialty === "Orthopedic Surgeon") return true
        return false
      })
      setFilteredDoctors(filtered)
    }
  }, [selectedSpecialty])

  // Reset selection when doctor changes
  useEffect(() => {
    setSelectedDate(null)
    setSelectedTime(null)
  }, [selectedDoctor])

  // Generate dates for the week view
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i))

  // Get the selected doctor object
  const doctor = DOCTORS.find((d) => d.id === selectedDoctor)

  // Check if a time slot is available
  const isTimeSlotAvailable = (date: Date, time: string) => {
    // Check if the doctor works on this day of the week
    if (!doctor?.availableDays.includes(date.getDay())) return false

    // Check if there's already an appointment at this time
    const dateString = format(date, "yyyy-MM-dd")
    return !appointments.some((apt) => apt.doctorId === selectedDoctor && apt.date === dateString && apt.time === time)
  }

  // Handle booking appointment
  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast({
        title: "Missing information",
        description: "Please select a doctor, date, and time for your appointment.",
        variant: "destructive",
      })
      return
    }

    setIsBooking(true)

    try {
      // In a real app, this would be an API call to save the appointment
      // await fetch('/api/appointments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     doctorId: selectedDoctor,
      //     date: format(selectedDate, 'yyyy-MM-dd'),
      //     time: selectedTime,
      //     patientId: user?.uid,
      //   }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add to local state for demo
      const newAppointment = {
        id: `apt${appointments.length + 1}`,
        doctorId: selectedDoctor,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        status: "confirmed",
      }

      setAppointments([...appointments, newAppointment])
      setBookingSuccess(true)

      toast({
        title: "Appointment booked",
        description: `Your appointment with ${doctor?.name} on ${format(selectedDate, "MMMM d, yyyy")} at ${selectedTime} has been confirmed.`,
      })

      // Reset form after successful booking
      setTimeout(() => {
        setSelectedDoctor(null)
        setSelectedDate(null)
        setSelectedTime(null)
        setBookingSuccess(false)
        setActiveTab("upcoming")
      }, 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem booking your appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsBooking(false)
    }
  }

  // Get upcoming appointments for the current user
  const upcomingAppointments = appointments.map((apt) => {
    const doctor = DOCTORS.find((d) => d.id === apt.doctorId)
    return {
      ...apt,
      doctor,
    }
  })

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-2 mb-8"
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
          Appointments
        </h1>
        <p className="text-muted-foreground">Schedule and manage your medical appointments</p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-primary/10 p-1">
          <TabsTrigger
            value="book"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Book Appointment
          </TabsTrigger>
          <TabsTrigger
            value="upcoming"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Upcoming Appointments
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Past Appointments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="space-y-6">
          {bookingSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center p-6"
            >
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600 dark:text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Appointment Booked Successfully!</h2>
              <p className="text-muted-foreground text-center mt-2 mb-6">
                Your appointment has been confirmed. You can view the details in your upcoming appointments.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                <div className="space-y-6">
                  <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Find a Doctor</CardTitle>
                      <CardDescription>Select a specialty to find available doctors</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Specialty</label>
                        <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                          <SelectTrigger className="border-primary/20 bg-primary/5 focus-visible:ring-primary">
                            <SelectValue placeholder="Select specialty" />
                          </SelectTrigger>
                          <SelectContent>
                            {SPECIALTIES.map((specialty) => (
                              <SelectItem key={specialty.id} value={specialty.id}>
                                {specialty.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid gap-4">
                    {filteredDoctors.map((doctor) => (
                      <Card
                        key={doctor.id}
                        className={`border-primary/20 transition-all duration-300 hover:shadow-md hover:shadow-primary/10 hover:border-primary/50 cursor-pointer ${
                          selectedDoctor === doctor.id
                            ? "bg-primary/10 border-primary/50"
                            : "bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm"
                        }`}
                        onClick={() => setSelectedDoctor(doctor.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border-2 border-primary/20">
                              <AvatarImage src={doctor.avatar} alt={doctor.name} />
                              <AvatarFallback>
                                {doctor.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{doctor.name}</h3>
                              <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{doctor.location}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {selectedDoctor ? (
                  <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Select Date & Time</CardTitle>
                        <CardDescription>
                          Choose an available time slot for your appointment with{" "}
                          {DOCTORS.find((d) => d.id === selectedDoctor)?.name}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-primary/20 bg-primary/5 hover:bg-primary/10"
                          onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-primary/20 bg-primary/5 hover:bg-primary/10"
                          onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-7 gap-2">
                        {weekDates.map((date) => {
                          const dayOfWeek = format(date, "EEE")
                          const dayOfMonth = format(date, "d")
                          const isAvailable = doctor?.availableDays.includes(date.getDay())
                          const isSelected = selectedDate && isSameDay(date, selectedDate)

                          return (
                            <div
                              key={date.toISOString()}
                              className={`flex flex-col items-center p-2 rounded-md cursor-pointer transition-colors ${
                                isAvailable
                                  ? isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-primary/10"
                                  : "opacity-50 cursor-not-allowed"
                              }`}
                              onClick={() => isAvailable && setSelectedDate(date)}
                            >
                              <span className="text-xs font-medium">{dayOfWeek}</span>
                              <span className="text-lg font-bold">{dayOfMonth}</span>
                            </div>
                          )
                        })}
                      </div>

                      {selectedDate && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-primary" />
                            <span className="font-medium">{format(selectedDate, "MMMM d, yyyy")}</span>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            {doctor?.timeSlots.map((time) => {
                              const isAvailable = isTimeSlotAvailable(selectedDate, time)
                              const isSelected = selectedTime === time

                              return (
                                <div
                                  key={time}
                                  className={`flex items-center justify-center p-2 rounded-md border cursor-pointer transition-colors ${
                                    isAvailable
                                      ? isSelected
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "border-primary/20 bg-primary/5 hover:bg-primary/10"
                                      : "opacity-50 cursor-not-allowed border-muted"
                                  }`}
                                  onClick={() => isAvailable && setSelectedTime(time)}
                                >
                                  <Clock className="h-4 w-4 mr-2" />
                                  <span>{time}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <GlowingButton
                        className="w-full"
                        disabled={!selectedDoctor || !selectedDate || !selectedTime || isBooking}
                        onClick={handleBookAppointment}
                      >
                        {isBooking ? "Booking..." : "Book Appointment"}
                      </GlowingButton>
                    </CardFooter>
                  </Card>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-8">
                      <CalendarIcon className="h-12 w-12 text-primary/20 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Select a Doctor</h3>
                      <p className="text-muted-foreground">
                        Choose a doctor from the list to see available appointment times
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          {upcomingAppointments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingAppointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <Badge className="bg-primary/20 text-primary border-primary/20">
                        {appointment.status === "confirmed" ? "Confirmed" : appointment.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        onClick={() => {
                          // In a real app, this would call an API to cancel the appointment
                          toast({
                            title: "Appointment cancelled",
                            description: "Your appointment has been cancelled successfully.",
                          })
                          setAppointments(appointments.filter((apt) => apt.id !== appointment.id))
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage src={appointment.doctor?.avatar} alt={appointment.doctor?.name} />
                        <AvatarFallback>
                          {appointment.doctor?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{appointment.doctor?.name}</h3>
                        <p className="text-sm text-muted-foreground">{appointment.doctor?.specialty}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        <span>
                          {format(parseISO(appointment.date), "MMMM d, yyyy")} at {appointment.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{appointment.doctor?.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      className="w-full border-primary/20 bg-primary/5 hover:bg-primary/10"
                      onClick={() => {
                        // In a real app, this would navigate to a reschedule page
                        toast({
                          title: "Reschedule",
                          description: "Reschedule functionality would open here.",
                        })
                      }}
                    >
                      Reschedule
                    </Button>
                    <GlowingButton
                      className="w-full"
                      onClick={() => {
                        router.push(
                          `/payment/appointment?doctorId=${appointment.doctorId}&date=${appointment.date}&time=${appointment.time}`,
                        )
                      }}
                    >
                      Pay Now
                    </GlowingButton>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <CalendarIcon className="h-12 w-12 text-primary/20 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Upcoming Appointments</h3>
              <p className="text-muted-foreground mb-6">You don't have any upcoming appointments scheduled.</p>
              <Button onClick={() => setActiveTab("book")}>Book an Appointment</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <CalendarIcon className="h-12 w-12 text-primary/20 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Past Appointments</h3>
            <p className="text-muted-foreground">Your past appointment history will appear here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

