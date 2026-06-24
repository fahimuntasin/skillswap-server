export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface TaskInput {
  title: string
  category: string
  description: string
  budget: number
  deadline: string
  client_email: string
}

export interface ProposalInput {
  task_id: string
  freelancer_email: string
  proposed_budget: number
  estimated_days: number
  cover_note: string
}

export interface ReviewInput {
  task_id: string
  reviewer_email: string
  reviewee_email: string
  rating: number
  comment: string
}

export type TaskStatus = "open" | "in_progress" | "completed"
export type ProposalStatus = "pending" | "accepted" | "rejected"
export type PaymentStatus = "pending" | "completed" | "failed"
export type UserRole = "client" | "freelancer" | "admin"
