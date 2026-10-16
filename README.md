# New Taj Palace Hotel & Luxury Suites

A modern, high-performance web application and cloud management system for **New Taj Palace Hotel**, built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

---

## ✨ Features

- **Guest Experience**:
  - Interactive multi-step booking engine with real-time rate calculation.
  - Multi-guest filtering (Adults, Children, Room Capacity).
  - Room & Suite showcases with video walkthroughs and photo galleries.
  - Meal add-ons (Breakfast, Half-Board, Full-Board) and promotional vouchers.
  - Printable branded invoice slips and booking confirmation vouchers.
  - Offline payment support (Bank Transfer, JazzCash, EasyPaisa) with mandatory proof upload.

- **Admin Management Portal**:
  - Live 10-second background cloud database auto-sync with non-disturbance safety protection.
  - Full reservation lifecycle management (Status approval, invoice editing, price adjustments).
  - Physical room inventory tracking and status assignment (Available, Occupied, Maintenance).
  - Room suite catalog manager with multi-image WebP uploads and YouTube video support.
  - Inquiries manager with single and batch deletion.
  - Hotel profile, social links, and banking configuration controls.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, SSG & Static Export)
- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Image Optimization**: [Sharp](https://sharp.pixelplumbing.com/) (automatic WebP compression under 80 KB)
- **Cloud Backend**: Supabase PostgreSQL & Cloudflare R2 / Storage

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (recommended >= 22.0.0)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Digizier/newtajpalace.git
   cd newtajpalace
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Copy `.env.example` to `.env.local` and add your database configuration:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build

To generate an optimized static production export:

```bash
npm run build
```

---

## 📄 License

Proprietary © New Taj Palace Hotel. All rights reserved.
