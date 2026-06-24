// Run: npx tsx src/scripts/seed.ts

import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/skillswap"

async function seed() {
  await mongoose.connect(MONGODB_URI)
  const db = mongoose.connection.db!

  await db.collection("users").deleteMany({})
  await db.collection("tasks").deleteMany({})
  await db.collection("proposals").deleteMany({})
  await db.collection("payments").deleteMany({})
  await db.collection("reviews").deleteMany({})

  await db.collection("users").insertOne({
    name: "Admin",
    email: "admin1@taskhive.com",
    role: "admin",
    image: "",
    skills: [],
    bio: "",
    hourlyRate: 0,
    isBlocked: false,
    createdAt: new Date(),
  })

  const freelancers = [
    { name: "Sarah Chen", email: "sarah@example.com", role: "freelancer", skills: ["UI Design", "Figma", "Branding"], hourlyRate: 45 },
    { name: "Alex Rivera", email: "alex@example.com", role: "freelancer", skills: ["React", "Node.js", "TypeScript"], hourlyRate: 55 },
    { name: "Emily Park", email: "emily@example.com", role: "freelancer", skills: ["Copywriting", "SEO", "Blogging"], hourlyRate: 35 },
  ]

  const clients = [
    { name: "John Client", email: "client@example.com", role: "client" },
    { name: "TechCorp CEO", email: "tech@example.com", role: "client" },
  ]

  for (const f of freelancers) {
    await db.collection("users").insertOne({
      ...f,
      image: "",
      bio: "Experienced professional with proven track record.",
      isBlocked: false,
      createdAt: new Date(),
    })
  }

  for (const c of clients) {
    await db.collection("users").insertOne({
      ...c,
      image: "",
      skills: [],
      bio: "",
      hourlyRate: 0,
      isBlocked: false,
      createdAt: new Date(),
    })
  }

  await db.collection("tasks").insertMany([
    { title: "Design landing page", category: "Design", description: "Modern landing page for SaaS", budget: 150, deadline: new Date("2026-07-15"), client_email: "client@example.com", status: "open", createdAt: new Date() },
    { title: "Fix CSS bugs", category: "Development", description: "Responsive issues on mobile", budget: 80, deadline: new Date("2026-07-10"), client_email: "tech@example.com", status: "open", createdAt: new Date() },
    { title: "Write SEO article", category: "Writing", description: "1000-word blog post", budget: 100, deadline: new Date("2026-07-20"), client_email: "client@example.com", status: "open", createdAt: new Date() },
  ])

  console.log("✅ Database seeded!")
  await mongoose.disconnect()
}

seed()
