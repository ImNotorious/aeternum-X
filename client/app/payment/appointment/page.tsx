"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { useWeb3 } from "@/hooks/use-web3"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Wallet, CreditCard, Calendar, Clock, AlertCircle, Check, ArrowLeft, ArrowRight } from "lucide-react"
import { GlowingButton } from "@/components/ui/glowing-button"
import { ethers } from "ethers"

interface Doctor {
  id: string
  name: string
  specialty: string
  consultationFee: string
  consultationFeeUsd: string
  avatar: string
}

export default function AppointmentPaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { account, connectWallet, signer } = useWeb3()

  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("crypto")

  const doctorId = searchParams.get("doctorId")
  const dateParam = searchParams.get("date")
  const timeParam = searchParams.get("time")

  const date = dateParam ? new Date(dateParam) : null
  const time = timeParam || null

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (!doctorId || !date || !time) {
      router.push("/doctors")
      return
    }

    const fetchDoctorDetails = async () => {
      try {
        setLoading(true)
        // In a real app, fetch from API
        // const response = await fetch(`/api/doctors?id=${doctorId}`)
        // const data = await response.json()
        // setDoctor(data)

        // Mock data for demonstration
        setDoctor({
          id: doctorId,
          name: "Dr. Arun Sharma",
          specialty: "Cardiologist",
          consultationFee: "0.05 ETH",
          consultationFeeUsd: "$100.00",
          avatar: "/placeholder.svg?height=100&width=100",
        })
      } catch (err) {
        setError("Failed to load doctor details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctorDetails()
  }, [doctorId, date, time, user, router])

  const handleCryptoPayment = async () => {
    if (!signer || !doctor) return

    try {
      setPaymentLoading(true)
      setError(null)

      // Convert ETH amount from string to proper value
      const ethAmount = doctor.consultationFee.replace(" ETH", "")
      const amountInWei = ethers.parseEther(ethAmount)

      // In a real app, this would be the doctor's wallet address
      const doctorAddress = "0x742d35Cc6634C0532925a3b844Bc0e3092f6E6B4"

      // Send the transaction
      const tx = await signer.sendTransaction({
        to: doctorAddress,
        value: amountInWei,
      })

      // Wait for transaction to be mined
      await tx.wait()

      // Save transaction details
      setTransactionHash(tx.hash)

      // In a real app, save appointment and transaction to database
      // await fetch('/api/appointments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId: user.uid,
      //     doctorId: doctor.id,
      //     date: date?.toISOString(),
      //     time,
      //     status: 'confirmed',
      //     transactionHash: tx.hash
      //   })
      // })

      setSuccess(true)
    } catch (err: any) {
      console.error("Payment error:", err)
      setError(err.message || "Failed to process payment")
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleCardPayment = async () => {
    // Simulate card payment
    setPaymentLoading(true)
    setError(null)

    // Simulate API call delay
    setTimeout(() => {
      setSuccess(true)
      setTransactionHash("card-payment-" + Date.now())
      setPaymentLoading(false)
    }, 2000)
  }

  const handlePayment = () => {
    if (paymentMethod === "crypto") {
      handleCryptoPayment()
    } else {
      handleCardPayment()
    }
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
        <p className="text-muted-foreground">Doctor not found or invalid appointment details</p>
        <Button onClick={() => router.push("/doctors")} className="mt-6">
          Back to Doctors
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-6"
        >
          <Card className="w-full border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Appointment Confirmed!</CardTitle>
              <CardDescription>Your payment has been processed successfully</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
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
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Date</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">{date?.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Time</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium">{time}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Payment Method</span>
                <div className="flex items-center gap-2">
                  {paymentMethod === "crypto" ? (
                    <>
                      <Wallet className="h-4 w-4 text-primary" />
                      <span className="font-medium">Ethereum</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span className="font-medium">Credit Card</span>
                    </>
                  )}
                </div>
              </div>

              {transactionHash && paymentMethod === "crypto" && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Transaction Hash</span>
                  <div className="p-2 bg-primary/5 rounded border border-primary/10 font-mono text-xs break-all">
                    {transactionHash}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-primary/10">
                <span className="font-medium">Total Paid</span>
                <div className="text-right">
                  <div className="font-bold text-primary">{doctor.consultationFee}</div>
                  <div className="text-xs text-muted-foreground">{doctor.consultationFeeUsd}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <GlowingButton asChild className="w-full">
                <a href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </GlowingButton>
              <Button variant="outline" className="w-full border-primary/20 bg-primary/5 hover:bg-primary/10" asChild>
                <a href={`/doctor/${doctor.id}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Doctor
                </a>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
              Complete Your Booking
            </h1>
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>

          <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
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
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Date</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">{date?.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Time</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium">{time}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-primary/10">
                <span className="font-medium">Consultation Fee</span>
                <div className="text-right">
                  <div className="font-bold text-primary">{doctor.consultationFee}</div>
                  <div className="text-xs text-muted-foreground">{doctor.consultationFeeUsd}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose how you want to pay for your appointment</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue={paymentMethod} onValueChange={setPaymentMethod}>
                <TabsList className="bg-primary/10 p-1 w-full">
                  <TabsTrigger
                    value="crypto"
                    className="w-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Pay with Crypto
                  </TabsTrigger>
                  <TabsTrigger
                    value="card"
                    className="w-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay with Card
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="crypto" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-medium">{doctor.consultationFee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">USD Equivalent</span>
                      <span className="font-medium">{doctor.consultationFeeUsd}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gas Fee (estimated)</span>
                      <span className="font-medium">0.001 ETH</span>
                    </div>
                    <div className="border-t border-primary/10 my-2 pt-2 flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-medium">0.051 ETH</span>
                    </div>
                  </div>

                  {!account ? (
                    <GlowingButton onClick={connectWallet} className="w-full">
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Wallet
                    </GlowingButton>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-3 bg-primary/5 border border-primary/10 rounded-md">
                        <p className="text-sm font-medium mb-1">Connected Wallet</p>
                        <p className="text-sm font-mono">{account}</p>
                      </div>
                      <GlowingButton onClick={handlePayment} className="w-full" disabled={paymentLoading}>
                        {paymentLoading ? "Processing..." : "Pay with Ethereum"}
                      </GlowingButton>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="card" className="mt-4 space-y-4">
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-md">
                    <h3 className="font-medium mb-2">Credit Card Payment</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You will be charged {doctor.consultationFeeUsd} for this appointment.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-sm font-medium mb-1 block">Card Number</label>
                        <input
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          className="w-full p-2 rounded-md border border-primary/20 bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full p-2 rounded-md border border-primary/20 bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">CVC</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full p-2 rounded-md border border-primary/20 bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                  </div>
                  <GlowingButton onClick={handlePayment} className="w-full" disabled={paymentLoading}>
                    {paymentLoading ? "Processing..." : `Pay ${doctor.consultationFeeUsd}`}
                  </GlowingButton>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col items-center text-center text-xs text-muted-foreground">
              <p>All payments are secure and encrypted</p>
              <p>You will receive a confirmation email after payment</p>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

