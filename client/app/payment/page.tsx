"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWeb3 } from "@/hooks/use-web3"
import { CreditCard, Wallet, Check, ArrowRight } from "lucide-react"
import { GlowingButton } from "@/components/ui/glowing-button"

export default function PaymentPage() {
  const router = useRouter()
  const { account, connectWallet } = useWeb3()
  const [paymentMethod, setPaymentMethod] = useState("crypto")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handlePayment = async () => {
    setLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)

      // Redirect after successful payment
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    }, 2000)
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <div className="flex flex-col gap-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            Complete Your Payment
          </h1>
          <p className="text-muted-foreground mt-2">Choose your preferred payment method</p>
        </motion.div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-6"
          >
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold">Payment Successful!</h2>
            <p className="text-muted-foreground text-center mt-2 mb-6">
              Your payment has been processed successfully. You will be redirected to your dashboard.
            </p>
            <GlowingButton asChild>
              <a href="/dashboard" className="flex items-center">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </GlowingButton>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Consultation with Dr. Sarah Johnson</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={paymentMethod} onValueChange={setPaymentMethod}>
                  <TabsList className="bg-primary/10 p-1">
                    <TabsTrigger
                      value="crypto"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      Crypto
                    </TabsTrigger>
                    <TabsTrigger
                      value="card"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Card
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="crypto" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-medium">0.05 ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">USD Equivalent</span>
                        <span className="font-medium">$100.00</span>
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
                        <GlowingButton onClick={handlePayment} className="w-full" disabled={loading}>
                          {loading ? "Processing..." : "Pay with Ethereum"}
                        </GlowingButton>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="card" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name on Card</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="number">Card Number</Label>
                        <Input
                          id="number"
                          placeholder="4242 4242 4242 4242"
                          className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            placeholder="123"
                            className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                    <GlowingButton onClick={handlePayment} className="w-full" disabled={loading}>
                      {loading ? "Processing..." : "Pay $100.00"}
                    </GlowingButton>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-col items-center text-center text-xs text-muted-foreground">
                <p>All payments are secure and encrypted</p>
                <p>You will receive a receipt via email after payment</p>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}

