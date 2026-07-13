# Blogify — Modern Blogging Platform

A full-featured blogging platform built with React 19 and Vite, offering role-based dashboards, rich content discovery, and a clean glass-morphism UI.

---

## Features

### Public
- **Home** — Hero section, trending blogs, category filters, newsletter signup
- **Explore** — Browse all blogs with debounced search, category pills, sort options, and pagination
- **Blog Details** — Full blog view with like, bookmark, share, and related posts
- **About** — Platform mission, values, and team

### Authentication
- Sign up with role selection (Reader / Writer)
- Login with JWT access & refresh token flow
- Persistent auth via Zustand + localStorage
- Automatic token refresh with request queue on 401

### Role-Based Dashboards
| Role | Dashboard | Features |
|------|-----------|----------|
| **Reader** | `/reader-dashboard` | Browse saved blogs, manage favourites |
| **Writer** | `/creater-dashboard` | Create, edit, delete own blogs with status filter & search |
| **Admin** | `/admin/dashboard` | Manage all blogs, view activity log |

### Writer Tools
- Create blog with cover image upload or URL
- Rich content editor with category selector
- Edit existing blogs
- Draft / Published status management

### Admin Tools
- View and delete any blog across the platform
- Activity log with timestamped events (publish, edit, delete, new user, likes)

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI |
| Icons | Lucide React |
| Server State | TanStack React Query v5 |
| Client State | Zustand v5 |
| HTTP Client | Axios |
| Forms | React Hook Form + Zod |
| Notifications | Sonner |
| Animations | tw-animate-css |

---

## Project Structure

```
src/
├── admin-dashboard/       # Admin dashboard page
├── Auth/                  # Login & SignUp pages
├── apis/                  # Axios API functions (blogApi, authApi)
├── components/
│   ├── ui/                # shadcn/ui base components
│   ├── BlogCard.jsx        # Reusable blog card with like & navigation
│   ├── Loader.jsx
│   └── pagination.jsx
├── CreaterDashboard/      # Writer dashboard, create & edit blog pages
├── hooks/                 # React Query hooks (useBlogapi, useAuthapi)
├── layout/
│   ├── MainLayout.jsx     # Protected layout with sidebar + header
│   ├── Navbar.jsx         # Top navigation with role-aware dropdown
│   └── SidebarLayout.jsx  # Role-based sidebar navigation
├── lib/
│   ├── apiClient.js       # Axios instance with JWT interceptors & refresh logic
│   └── utils.js
├── pages/                 # Home, Explore, BlogDetails, About, Profile
├── reader-dashboard/      # Reader dashboard & favourites page
├── Schema/                # Zod validation schemas
├── store/                 # Zustand auth store
└── App.jsx                # Route definitions
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/blogify-frontend.git
cd blogify-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_BASE_URL=https://your-backend-api.com/api
```

### Run Locally

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## Routes

### Public Routes
| Path | Page |
|------|------|
| `/` | Home |
| `/explore` | Explore blogs |
| `/blog/:id` | Blog details |
| `/about` | About |
| `/login` | Login |
| `/signup` | Sign Up |

### Protected Routes (require login)
| Path | Page | Role |
|------|------|------|
| `/reader-dashboard` | Reader Dashboard | Reader |
| `/favorite-blogs` | Favourite Blogs | Reader |
| `/creater-dashboard` | Writer Dashboard | Writer |
| `/creater-blog` | Create Blog | Writer |
| `/creator/edit/:id` | Edit Blog | Writer |
| `/admin/dashboard` | Admin Dashboard | Admin |
| `/profile-setting` | Profile Settings | All |

---

## Key Implementation Details

- **JWT Refresh Flow** — `apiClient.js` queues failed requests during token refresh and retries them automatically, preventing multiple simultaneous refresh calls
- **Debounced Search** — Explore page uses a 500ms debounce on the search input, updating the React Query key only after the user stops typing
- **Role-Based Navigation** — Navbar and Sidebar dynamically render links based on the authenticated user's role (`admin` / `writer` / `reader`)
- **Optimistic UI** — Like, favourite, and delete actions use React Query mutations with cache invalidation for instant feedback

---

## Deployment

The project is deployed on **Vercel**. Push to the `main` branch to trigger an automatic deployment.

> Note: Vercel runs on Linux (case-sensitive filesystem). Ensure all import paths match the exact filename casing.

---

## License

MIT © 2024 Blogify
