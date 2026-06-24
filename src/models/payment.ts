import mongoose, { Document, Model } from "mongoose"

export interface IPayment extends Document {
  client_email: string
  freelancer_email: string
  task_id: mongoose.Types.ObjectId
  amount: number
  transaction_id: string
  payment_status: "pending" | "completed" | "failed"
  paid_at: Date
}

const paymentSchema = new mongoose.Schema<IPayment>({
  client_email: { type: String, required: true },
  freelancer_email: { type: String, required: true },
  task_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  amount: { type: Number, required: true },
  transaction_id: { type: String, required: true },
  payment_status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  paid_at: { type: Date, default: Date.now },
})

export const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>("Payment", paymentSchema)
