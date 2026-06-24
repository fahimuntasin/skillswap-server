# SkillSwap Server API

Backend for SkillSwap — Freelance Micro-Task Platform. Built with **Next.js**, **MongoDB**, **BetterAuth**, and **Stripe**.

## Tech Stack

- **Next.js 16** — API Routes with Turbopack
- **MongoDB** — Database with Mongoose ODM
- **BetterAuth** — Authentication (Email/Password + Google OAuth)
- **Stripe** — Payment processing
- **TypeScript** — Type safety

## Getting Started

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your MongoDB URI, BetterAuth secret, Stripe keys
npm run dev
```

## Environment Variables

```
MONGODB_URI=mongodb://localhost:27017/skillswap
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3001
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
```

## API Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| ALL | `/api/auth/*` | BetterAuth handler |

### Tasks
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tasks?page=1&limit=9` | List open tasks (paginated) |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks?id=xxx` | Update task |
| DELETE | `/api/tasks?id=xxx` | Delete task |
| PATCH | `/api/tasks/complete?id=xxx` | Complete task + submit deliverable |

### Proposals
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/proposals?task_id=xxx` | List proposals |
| POST | `/api/proposals` | Submit proposal |
| PATCH | `/api/proposals?id=xxx` | Accept/reject proposal |

### Payments
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/payments` | Create Stripe checkout |
| PUT | `/api/payments?session_id=xxx` | Confirm payment |
| GET | `/api/payments` | List all payments |

### Users & Freelancers
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users?role=freelancer` | List users |
| PATCH | `/api/users?id=xxx` | Block/unblock user |
| GET | `/api/freelancers?limit=10` | Freelancers with ratings |
| GET | `/api/earnings?email=xxx` | Freelancer earnings |

### Admin
| Method | Path | Description |
|--------|------|-------------|
| DELETE | `/api/admin/tasks?id=xxx` | Delete task + cascade |
| GET | `/api/admin/revenue` | Revenue analytics |
| PATCH | `/api/admin/users?id=xxx` | Block/unblock user |

### Other
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/stats` | Platform statistics |
| GET | `/api/health` | Health check |
| GET | `/api/reviews` | Get reviews |
| POST | `/api/reviews` | Create review |
| GET | `/api/client-tasks?client_email=xxx` | Client's tasks |

## Database Models

- **users** — name, email, image, role, skills, bio, isBlocked
- **tasks** — title, category, description, budget, deadline, client_email, status
- **proposals** — task_id, freelancer_email, proposed_budget, estimated_days, status
- **payments** — client_email, freelancer_email, task_id, amount, transaction_id
- **reviews** — task_id, reviewer_email, reviewee_email, rating, comment

## Seed Database

```bash
npx tsx src/scripts/seed.ts
```

Creates admin user (`admin1@taskhive.com`), sample freelancers, clients, and tasks.
