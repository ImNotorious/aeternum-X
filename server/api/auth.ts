import type { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"
import dbConnect from "../db/connect"
import User from "../models/User"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case "POST":
      try {
        const { email, password } = req.body

        // Find user by email
        const user = await User.findOne({ email })
        if (!user) {
          return res.status(400).json({ success: false, message: "Invalid credentials" })
        }

        // Check password
        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
          return res.status(400).json({ success: false, message: "Invalid credentials" })
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" })

        res.status(200).json({
          success: true,
          token,
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
            profileCompleted: user.profileCompleted,
          },
        })
      } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error })
      }
      break
    default:
      res.status(405).json({ success: false, message: "Method not allowed" })
      break
  }
}

