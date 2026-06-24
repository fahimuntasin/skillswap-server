import { betterAuth } from "better-auth"

export const auth = betterAuth({
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

