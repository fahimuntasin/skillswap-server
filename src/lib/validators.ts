export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 6) return { valid: false, message: "Password must be at least 6 characters" }
  if (!/[A-Z]/.test(password)) return { valid: false, message: "Password must contain at least one uppercase letter" }
  if (!/[a-z]/.test(password)) return { valid: false, message: "Password must contain at least one lowercase letter" }
  return { valid: true, message: "" }
}

export function validateBudget(budget: number): boolean {
  return budget > 0 && budget <= 100000
}

export function validateRating(rating: number): boolean {
  return rating >= 1 && rating <= 5
}
