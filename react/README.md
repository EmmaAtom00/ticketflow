# 🎫 TicketFlow (React Version)

A modern, responsive ticket management system built with **React**, **TypeScript**, and **Tailwind CSS**.  
TicketFlow provides a clean interface for managing support tickets with full CRUD functionality, authentication, and real-time status tracking.

---

## Frameworks & Libraries Used

### Core

- **React** v18.3.1 – UI framework
- **TypeScript** v5.x – Type-safe JavaScript
- **Vite** v5.x – Fast build tool and dev server

### Styling & UI

- **Tailwind CSS** v3.x – Utility-first CSS framework
- **shadcn/ui** – Component system built on Radix UI
- **Lucide React** – Icon library
- **tailwindcss-animate** – Animation utilities
- **class-variance-authority**, **clsx**, **tailwind-merge** – Class and variant utilities

### Routing & State

- **React Router DOM** v6.30.1 – Client-side routing
- **TanStack Query** v5.83.0 – Server state management
- **React Hook Form** v7.61.1 – Form management

### Validation & Notifications

- **Zod** v3.25.76 – Schema validation
- **Sonner** v1.7.4 – Toast notifications
- **@hookform/resolvers** v3.10.0 – Integration between React Hook Form and Zod

### Utilities

- **date-fns** v3.6.0 – Date utilities
- **clsx** – Conditional className utility
- **class-variance-authority** – Variant management

---

## Setup & Execution Steps

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager

### Steps

1. **Clone the repository**

   ```bash
   git clone <YOUR_GIT_URL>
   cd ticketflow/react
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**

   ```
   http://localhost:5173
   ```

5. **Build for production (optional)**

   ```bash
   npm run build
   ```

---

## UI Components & State Structure

### UI Components

TicketFlow uses **shadcn/ui** components built with Tailwind CSS and Radix UI for accessibility.

#### Core Components

- **Button** – Variants: primary, secondary, outline, ghost
- **Card** – Container with shadow and padding
- **Input**, **Textarea**, **Label** – Form controls
- **Select**, **Dialog**, **Alert Dialog**, **Badge** – Interactive UI elements
- **Toast (Sonner)** – Notification system

#### Custom Components

- **Layout** (`src/components/Layout.tsx`) – Page wrapper with header & footer
- **ProtectedRoute** (`src/components/ProtectedRoute.tsx`) – Route guard for auth pages
- **DecorativeCircle** (`src/components/DecorativeCircle.tsx`) – Decorative background element
- **WaveBackground** (`src/components/WaveBackground.tsx`) – SVG wave hero background

---

### State Management

#### Authentication

- **Location:** `src/lib/auth.ts`
- **Storage:** `localStorage`
- **Methods:**

  - `getSession()` – Retrieve active session
  - `saveSession()` – Save user session
  - `clearSession()` – Logout and clear session

#### Tickets

- **Location:** `src/lib/tickets.ts`
- **Storage:** `localStorage`
- **Methods:**

  - `getTickets()` – Retrieve all tickets
  - `createTicket()` – Add a new ticket
  - `updateTicket()` – Modify a ticket
  - `deleteTicket()` – Remove a ticket
  - `getTicketStats()` – Dashboard statistics

#### Data Structure Example

```ts
interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: "open" | "in_progress" | "closed";
  priority?: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}
```

---

## Accessibility Notes

TicketFlow adheres to **WCAG 2.1 Level AA** guidelines.

### Implemented Features

- Semantic HTML structure (`header`, `main`, `footer`, `nav`)
- ARIA labels on interactive elements
- Full keyboard navigation support
- Visible focus states on buttons & inputs
- High color contrast ratios (≥ 4.5:1)
- Screen reader compatibility (NVDA, JAWS)
- Responsive text with `rem` units
- Descriptive alt text on images

---

## Known Issues & Limitations

1. **Authentication:** LocalStorage-based (not secure; no password hashing).
2. **Data Persistence:** Data cleared when browser storage is reset.
3. **Backend:** No API or database — front-end simulation only.
4. **Multi-user Support:** Single-user mode, no collaboration.
5. **Real-Time Features:** No live updates or notifications.

---

## Example Test Credentials

| Email                                               | Password | Name         |
| --------------------------------------------------- | -------- | ------------ |
| [admin@ticketflow.com](mailto:admin@ticketflow.com) | admin123 | Admin User   |
| [user@example.com](mailto:user@example.com)         | password | Test User    |
| [demo@test.com](mailto:demo@test.com)               | demo1234 | Demo Account |

> Authentication is simulated — you can create any test account using the signup form.
