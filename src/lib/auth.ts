import { betterAuth } from "better-auth"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017/skillswap")

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  trustedOrigins: ["http://localhost:3003", "http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "client" },
      skills: { type: "string[]", defaultValue: [] },
      bio: { type: "string", defaultValue: "" },
      image: { type: "string" },
      hourlyRate: { type: "number", defaultValue: 0 },
      isBlocked: { type: "boolean", defaultValue: false },
    },
  },
})
