# 💎 Ether-AI HRMS (Frontend)

Welcome to the **Ether-AI Human Resource Management System**. This is a premium, high-performance dashboard designed to manage employee data and attendance tracking with a modern, glassmorphic aesthetic.

---

## 🚀 Quick Start (For Developers)

To get the frontend running locally, follow these simple steps:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Create a `.env.local` file in the root directory and add your backend URL:
    ```env
    NEXT_PUBLIC_API_URL=https://hrms-lite-application-backend.onrender.com/api
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## 🔐 Administrative Access

Access the portal using the following pre-configured admin credentials:

| Type | Credential |
| :--- | :--- |
| **Username** | `admin` |
| **Password** | `admin123` |

---

## ✨ Key Features

-   **Premium Dashboard**: Real-time statistics overview of total employees and today's attendance.
-   **Advanced Employee Management**:
    -   Dynamic **Grid/List View** toggles.
    -   Smart Search and Department filtering.
    -   Interactive Employee cards with smooth animations.
    -   "Favorites" system for high-priority staff.
-   **Smart Attendance Tracking**:
    -   Mark attendance for 7 different status types (Present, WFH, Sick Leave, etc.).
    -   **Attendance History Modal**: Visualize data with Calendar, Timeline, and Statistical views.
    -   CSV Export functionality for reporting.
-   **Safe UI Components**: Fully typed TypeScript architecture with shared interfaces to prevent runtime crashes.
-   **Premium Aesthetics**: Dark mode optimized with gold (`#C9A227`) accents and glassmorphic effects.

---

## 🛠 Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Date Handling**: [date-fns](https://date-fns.org/)
-   **API Client**: [Axios](https://axios-http.com/)

---

## 📁 Project Structure

```text
frontend/
├── app/
│   ├── components/       # UI Components (Buttons, Modals, Cards)
│   ├── lib/              # Utils and API configuration
│   ├── types/            # Centralized TypeScript interfaces
│   ├── page.tsx          # Main Dashboard entry point
│   └── globals.css       # Core styling & Design system tokens
```

---

## 🚢 Deployment

The frontend is optimized for deployment on **Vercel** or **Render**. Ensure that the `NEXT_PUBLIC_API_URL` is set in your production environment variables to point to your live backend.

---

Developed with ❤️ by the **Ether-AI Team**.
