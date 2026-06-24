import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017/skillswap")
const db = client.db()

export const auth = betterAuth({
  database: {
    db,
    type: "mongodb",
  },
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
      role: {
        type: "string",
        defaultValue: "client",
      },
      skills: {
        type: "string[]",
        defaultValue: [],
      },
      bio: {
        type: "string",
        defaultValue: "",
      },
      image: {
        type: "string",
      },
      hourlyRate: {
        type: "number",
        defaultValue: 0,
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false,
      },
    },
  },
})
