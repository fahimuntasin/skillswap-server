import mongoose, { Document, Model } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  image?: string
  role: "client" | "freelancer" | "admin"
  skills: string[]
  bio?: string
  hourlyRate?: number
  isBlocked: boolean
  createdAt: Date
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, default: "" },
  role: { type: String, enum: ["client", "freelancer", "admin"], default: "client" },
  skills: { type: [String], default: [] },
  bio: { type: String, default: "" },
  hourlyRate: { type: Number, default: 0 },
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema)
