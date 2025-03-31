"use client"

import { createContext, useEffect, useState, type ReactNode } from "react"
import { ethers } from "ethers"

interface Web3ContextType {
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  account: string | null
  chainId: number | null
  connectWallet: () => Promise<void>
  isConnecting: boolean
  error: string | null
}

export const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  account: null,
  chainId: null,
  connectWallet: async () => {},
  isConnecting: false,
  error: null,
})

export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setError("MetaMask is not installed")
      return
    }

    try {
      setIsConnecting(true)
      setError(null)

      // Request account access
      const browserProvider = new ethers.BrowserProvider(window.ethereum)
      await browserProvider.send("eth_requestAccounts", [])

      const networkInfo = await browserProvider.getNetwork()
      const chainId = Number(networkInfo.chainId)

      const signer = await browserProvider.getSigner()
      const address = await signer.getAddress()

      setProvider(browserProvider)
      setSigner(signer)
      setAccount(address)
      setChainId(chainId)
    } catch (err) {
      console.error("Error connecting to wallet:", err)
      setError("Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      if (typeof window === "undefined" || !window.ethereum) return

      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await browserProvider.listAccounts()

        if (accounts.length > 0) {
          const networkInfo = await browserProvider.getNetwork()
          const chainId = Number(networkInfo.chainId)

          const signer = await browserProvider.getSigner()
          const address = await signer.getAddress()

          setProvider(browserProvider)
          setSigner(signer)
          setAccount(address)
          setChainId(chainId)
        }
      } catch (err) {
        console.error("Error checking connection:", err)
      }
    }

    checkConnection()

    // Setup event listeners
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          setProvider(null)
          setSigner(null)
          setAccount(null)
        } else {
          // Account changed, reconnect
          connectWallet()
        }
      })

      window.ethereum.on("chainChanged", () => {
        // Chain changed, reconnect
        connectWallet()
      })
    }

    return () => {
      // Cleanup event listeners
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeAllListeners()
      }
    }
  }, [])

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        account,
        chainId,
        connectWallet,
        isConnecting,
        error,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

