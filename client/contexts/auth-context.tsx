"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

// Extend the User type to include role
interface ExtendedUser extends User {
  role?: string
}

interface AuthContextType {
  user: ExtendedUser | null
  userRole: string | null
  loading: boolean
  signUp: (email: string, password: string, name: string, role?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInAsHospital: (email: string, password: string) => Promise<void>
  signInWithGoogle: (isHospital?: boolean) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signInAsHospital: async () => {},
  signInWithGoogle: async () => {},
  logout: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Store roles in localStorage to persist between sessions
  const saveRoleToLocalStorage = (userId: string, role: string) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`user_role_${userId}`, role)
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }
    }
  }

  const getRoleFromLocalStorage = (userId: string): string | null => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem(`user_role_${userId}`)
      } catch (error) {
        console.error("Error reading from localStorage:", error)
        return null
      }
    }
    return null
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // Get user role from localStorage
        const savedRole = getRoleFromLocalStorage(authUser.uid) || "patient"

        // Create extended user with role
        const extendedUser = {
          ...authUser,
          role: savedRole,
        } as ExtendedUser

        setUser(extendedUser)
        setUserRole(savedRole)
      } else {
        setUser(null)
        setUserRole(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name: string, role = "patient") => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const authUser = userCredential.user

      // Update profile with name
      await updateProfile(authUser, { displayName: name })

      // Save role to localStorage
      saveRoleToLocalStorage(authUser.uid, role)

      // Create extended user
      const extendedUser = {
        ...authUser,
        role,
      } as ExtendedUser

      setUser(extendedUser)
      setUserRole(role)
    } catch (error) {
      console.error("Error during signup:", error)
      throw error
    }
  }

  // Add a function to store the Firebase auth token in localStorage
  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const authUser = userCredential.user

      // Get role from localStorage
      const savedRole = getRoleFromLocalStorage(authUser.uid) || "patient"

      // Store the auth token in localStorage
      const token = await authUser.getIdToken()
      if (typeof window !== "undefined") {
        localStorage.setItem("firebase-auth-token", token)
      }

      // Create extended user
      const extendedUser = {
        ...authUser,
        role: savedRole,
      } as ExtendedUser

      setUser(extendedUser)
      setUserRole(savedRole)
    } catch (error) {
      console.error("Error during sign in:", error)
      throw error
    }
  }

  const signInAsHospital = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const authUser = userCredential.user

      // Always set role to hospital for hospital login
      const role = "hospital"
      saveRoleToLocalStorage(authUser.uid, role)

      // Store the auth token in localStorage
      const token = await authUser.getIdToken()
      if (typeof window !== "undefined") {
        localStorage.setItem("firebase-auth-token", token)
      }

      // Create extended user
      const extendedUser = {
        ...authUser,
        role,
      } as ExtendedUser

      setUser(extendedUser)
      setUserRole(role)
    } catch (error) {
      console.error("Error during hospital sign in:", error)
      throw error
    }
  }

  const signInWithGoogle = async (isHospital?: boolean): Promise<void> => {
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()

      provider.setCustomParameters({
        prompt: "select_account",
        login_hint: isHospital ? "hospital@example.com" : "patient@example.com",
      })

      const result = await signInWithPopup(auth, provider)
      const authUser = result.user

      const role = isHospital ? "hospital" : "patient"
      saveRoleToLocalStorage(authUser.uid, role)

      // Store the auth token in localStorage
      const token = await authUser.getIdToken()
      if (typeof window !== "undefined") {
        localStorage.setItem("firebase-auth-token", token)
      }

      const extendedUser = {
        ...authUser,
        role,
      } as ExtendedUser

      setUser(extendedUser)
      setUserRole(role)
    } catch (error) {
      setLoading(false)
      console.error("Google sign in error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      // Clear the auth token from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("firebase-auth-token")
      }

      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error during logout:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        loading,
        signUp,
        signIn,
        signInAsHospital,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

