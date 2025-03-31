import type { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"
import User from "../models/User"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export function authMiddleware(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Check for token in headers
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ success: false, message: "No token, authorization denied" })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as any

      // Find user by id
      const user = await User.findById(decoded.id).select("-password")

      if (!user) {
        return res.status(401).json({ success: false, message: "User not found" })
      }
      // Add user to request
      ;(req as any).user = user

      // Call the original handler
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ success: false, message: "Token is not valid" })
    }
  }
}

