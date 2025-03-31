import type { NextApiRequest, NextApiResponse } from "next"
import dbConnect from "../db/connect"
import User from "../models/User"
import { authMiddleware } from "../middleware/auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case "POST":
      try {
        const { email, password, role } = req.body

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
          return res.status(400).json({ success: false, message: "User already exists" })
        }

        // Create new user
        const user = new User({
          email,
          password,
          role: role || "user",
          profileCompleted: false,
          createdAt: new Date(),
        })

        await user.save()

        res.status(201).json({
          success: true,
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
            profileCompleted: user.profileCompleted,
          },
        })
      } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error })
      }
      break
    case "GET":
      try {
        // This route should be protected
        const { user } = req as any

        if (!user || user.role !== "hospital") {
          return res.status(403).json({ success: false, message: "Unauthorized" })
        }

        const users = await User.find().select("-password")
        res.status(200).json({ success: true, data: users })
      } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error })
      }
      break
    default:
      res.status(405).json({ success: false, message: "Method not allowed" })
      break
  }
}

export default authMiddleware(handler)

