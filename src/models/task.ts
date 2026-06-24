import mongoose, { Document, Model } from "mongoose"

export interface ITask extends Document {
  title: string
  category: string
  description: string
  budget: number
  deadline: Date
  client_email: string
  status: "open" | "in_progress" | "completed"
  deliverable_url?: string
  createdAt: Date
}

const taskSchema = new mongoose.Schema<ITask>({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  deadline: { type: Date, required: true },
  client_email: { type: String, required: true },
  status: { type: String, enum: ["open", "in_progress", "completed"], default: "open" },
  deliverable_url: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
})

export const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>("Task", taskSchema)
