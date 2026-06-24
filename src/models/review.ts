import mongoose, { Document, Model } from "mongoose"

export interface IReview extends Document {
  task_id: mongoose.Types.ObjectId
  reviewer_email: string
  reviewee_email: string
  rating: number
  comment: string
  created_at: Date
}

const reviewSchema = new mongoose.Schema<IReview>({
  task_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  reviewer_email: { type: String, required: true },
  reviewee_email: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
})

export const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema)
