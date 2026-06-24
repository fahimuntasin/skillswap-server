import mongoose, { Document, Model } from "mongoose"

export interface IProposal extends Document {
  task_id: mongoose.Types.ObjectId
  freelancer_email: string
  proposed_budget: number
  estimated_days: number
  cover_note: string
  status: "pending" | "accepted" | "rejected"
  submitted_at: Date
}

const proposalSchema = new mongoose.Schema<IProposal>({
  task_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  freelancer_email: { type: String, required: true },
  proposed_budget: { type: Number, required: true },
  estimated_days: { type: Number, required: true },
  cover_note: { type: String, required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  submitted_at: { type: Date, default: Date.now },
})

export const Proposal: Model<IProposal> = mongoose.models.Proposal || mongoose.model<IProposal>("Proposal", proposalSchema)
