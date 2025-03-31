import type React from "react"
import type { Metadata } from "next"
import { Mona_Sans as FontSans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Web3Provider } from "@/components/web3-provider"
import { AuthProvider } from "@/contexts/auth-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { GlobalParticles } from "@/components/global-particles"
import { Toaster } from "@/components/toaster"
import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Aeternum | Medical Platform",
  description: "Revolutionising Safe and Effective Medical Diagnosis using Machine Learning",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Web3Provider>
              <div className="flex min-h-screen flex-col">
                <GlobalParticles />
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <Toaster />
              </div>
            </Web3Provider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

