"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, CreditCard, Wallet } from "lucide-react"
import { GlowingButton } from "@/components/ui/glowing-button"

export default function DashboardPayments() {
  const [payments, setPayments] = useState([
    {
      id: "INV-001",
      date: "2023-04-10",
      amount: "0.05 ETH",
      amountUsd: "$100.00",
      description: "Consultation with Dr. Sarah Johnson",
      status: "completed",
      method: "crypto",
    },
    {
      id: "INV-002",
      date: "2023-04-05",
      amount: "0.08 ETH",
      amountUsd: "$160.00",
      description: "MRI Scan",
      status: "completed",
      method: "crypto",
    },
    {
      id: "INV-003",
      date: "2023-03-28",
      amount: "$75.00",
      amountUsd: "$75.00",
      description: "Blood Test",
      status: "completed",
      method: "card",
    },
    {
      id: "INV-004",
      date: "2023-03-15",
      amount: "0.03 ETH",
      amountUsd: "$60.00",
      description: "Consultation with Dr. Michael Chen",
      status: "completed",
      method: "crypto",
    },
  ])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Payment History</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-primary/20 bg-primary/5 hover:bg-primary/10">
            <CreditCard className="mr-2 h-4 w-4" />
            Add Payment Method
          </Button>
          <GlowingButton size="sm">
            <Wallet className="mr-2 h-4 w-4" />
            Add Funds
          </GlowingButton>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>View and manage your payment history</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment, index) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-primary/5"
                  >
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                    <TableCell>{payment.description}</TableCell>
                    <TableCell>
                      <div className="font-medium">{payment.amount}</div>
                      <div className="text-xs text-muted-foreground">{payment.amountUsd}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payment.method === "crypto" ? (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          Ethereum
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Credit Card</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
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

