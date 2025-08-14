# 🌐 INVOXA Frontend

The **web interface** for the INVOXA platform.

## 📁 Project Structure

```
frontend/
├── app/                # Next.js app directory
│   ├── api/            # API routes (auth, client, invoice, insights)
│   ├── login/          # Login page
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main entry page
│   └── providers.tsx   # Context providers
├── components/
│   └── ui/             # UI components (header, sidebar, pages, charts)
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
```

## 📌 Features

- Dashboard for invoices, clients, and payments
- Authentication (login, logout, register, protected routes)
- API integration with backend services
- Modular UI components (header, sidebar, charts)
- State management (Zustand or Redux)
- Insights and notifications

## 🛠 Tech Stack

- **React** / **Next.js** (App Router)
- **TypeScript**
- **Zustand** or **Redux** (state management)
- **CSS Modules**

## 🚀 Running Locally

```bash
cd frontend
npm install
npm run dev
```

**Local URL:** [http://localhost:3000](http://localhost:3000)

---

Feel free to explore the codebase and contribute!
