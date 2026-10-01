# Arafat Portfolio | Application Security Engineer

<div align="center">
  <h3><em>Cybersecurity Expert | Application Security Engineer | Web Developer</em></h3>

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

</div>

## 📋 Overview

This repository contains the source code for my professional portfolio website, designed with a unique hacker-inspired aesthetic. The portfolio serves as a comprehensive showcase of my expertise in application security, cybersecurity, and web development.

### Key Highlights

- **Cybersecurity Focus**: Demonstrates my professional experience in application security and cybersecurity
- **Interactive UI**: Features a dark, terminal-inspired interface with dynamic elements
- **Modern Architecture**: Built with Next.js 16, TypeScript, and Tailwind CSS
- **Performance Optimized**: Fast loading times with efficient code structure
- **Self-Hosted Solution**: Complete control over data with no third-party dependencies

## ✨ Features & Functionality

### 🎨 User Interface & Design

| Feature                   | Description                                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Hacker-Inspired Theme** | Dark interface with neon green accents and terminal-style elements that create an immersive cybersecurity aesthetic |
| **Interactive Elements**  | Dynamic components with hover effects, click interactions, and state changes                                        |
| **Responsive Design**     | Fully adaptive layout that works seamlessly across desktop, tablet, and mobile devices                              |
| **Custom Animations**     | Carefully crafted animations including typing effects, scan lines, glitch effects, and digital noise                |
| **Sound Effects**         | Optional audio feedback for interactions, with user-controlled mute functionality                                   |
| **Accessibility**         | High contrast ratios, keyboard navigation support, and semantic HTML structure                                      |

### 📱 Core Sections & Pages

| Section              | Purpose                      | Key Features                                                            |
| -------------------- | ---------------------------- | ----------------------------------------------------------------------- |
| **Dashboard**        | Main hub and entry point     | Profile information, social links, navigation, activity cards           |
| **Skills Page**      | Technical expertise showcase | Interactive skill badges, filterable categories, proficiency indicators |
| **Projects Gallery** | Portfolio of work            | Detailed project cards, technology tags, live demos, source code links  |
| **Blog Section**     | Knowledge sharing            | Article previews, reading time estimates, category filtering            |
| **Contact Form**     | Professional communication   | Form validation, email delivery, confirmation feedback                  |

### 🛠️ Technical Implementation

| Aspect                    | Details                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------- |
| **Frontend Architecture** | Built with Next.js 16 App Router, React 19 Server Components, and TypeScript           |
| **Styling System**        | Tailwind CSS with custom utility classes and responsive design principles              |
| **Performance**           | Optimized asset loading, code splitting, and server-side rendering for fast page loads |
| **Security**              | Input validation, CSRF protection, and secure form handling                            |
| **SEO**                   | Structured metadata, semantic HTML, Open Graph tags, and sitemap generation            |
| **Email Handling**        | Self-hosted SMTP solution for contact form submissions                                 |

## 🔧 Technology Stack

<table>
  <tr>
    <th>Category</th>
    <th>Technologies</th>
    <th>Purpose</th>
  </tr>
  <tr>
    <td><strong>Core</strong></td>
    <td>
      <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js"></a><br>
      <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React"></a><br>
      <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript"></a>
    </td>
    <td>Application framework, UI library, and type safety</td>
  </tr>
  <tr>
    <td><strong>Styling</strong></td>
    <td>
      <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind"></a><br>
      <a href="https://ui.shadcn.com/"><img src="https://img.shields.io/badge/shadcn/ui-0.5-black?style=flat-square" alt="shadcn/ui"></a>
    </td>
    <td>Utility-first CSS and accessible component library</td>
  </tr>
  <tr>
    <td><strong>UI Enhancements</strong></td>
    <td>
      <a href="https://lucide.dev/"><img src="https://img.shields.io/badge/Lucide-0.284-black?style=flat-square" alt="Lucide"></a><br>
      <a href="https://www.framer.com/motion/"><img src="https://img.shields.io/badge/Framer_Motion-10-0055FF?style=flat-square" alt="Framer Motion"></a>
    </td>
    <td>Icons, animations, and interactive elements</td>
  </tr>
  <tr>
    <td><strong>Form & Data</strong></td>
    <td>
      <a href="https://react-hook-form.com/"><img src="https://img.shields.io/badge/React_Hook_Form-7-EC5990?style=flat-square" alt="React Hook Form"></a><br>
      <a href="https://zod.dev/"><img src="https://img.shields.io/badge/Zod-3-3068B7?style=flat-square" alt="Zod"></a><br>
      <a href="https://nodemailer.com/"><img src="https://img.shields.io/badge/Nodemailer-6-22B573?style=flat-square" alt="Nodemailer"></a>
    </td>
    <td>Form handling, validation, and email functionality</td>
  </tr>
</table>

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.18.0 or higher
- **Package Manager**: pnpm (recommended) or npm
- **Environment**: Basic knowledge of React and Next.js

### Step-by-Step Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/arafat-portfolio.git
   cd arafat-portfolio
   ```

2. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```bash
   # Email Configuration (for contact form)
   SMTP_HOST=your-smtp-host
   SMTP_PORT=587
   SMTP_USER=your-email@example.com
   SMTP_PASSWORD=your-password
   SMTP_FROM="Your Name <your-email@example.com>"
   CONTACT_EMAIL=your-email@example.com
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

4. **Start the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **View the application**

   Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Deployment

1. **Build the application**

   ```bash
   pnpm build
   # or
   npm run build
   ```

2. **Start the production server**

   ```bash
   pnpm start
   # or
   npm start
   ```

## 📂 Project Structure

```bash
arafat-portfolio/
├── app/                    # Next.js App Router
│   ├── api/                # API routes for contact form
│   │   └── contact/        # Email sending endpoint
│   ├── blog/               # Blog section with article previews
│   ├── contact/            # Contact form with validation
│   ├── dashboard/          # Main dashboard with profile and navigation
│   ├── projects/           # Projects showcase with filtering
│   ├── skills/             # Skills page with interactive badges
│   ├── globals.css         # Global styles and animations
│   ├── layout.tsx          # Root layout with metadata
│   └── page.tsx            # Homepage component
├── components/             # Reusable UI components
│   ├── ui/                 # Base UI components (buttons, cards, etc.)
│   └── shared/             # Shared components used across pages
├── data/                   # JSON data files
│   ├── skills.json         # Skills data with categories
│   └── projects.json       # Project information
├── lib/                    # Utility functions and helpers
│   └── utils.ts            # Common utility functions
├── public/                 # Static assets
│   ├── images/             # Image files for projects and UI
│   └── sounds/             # Sound effects for interactions
├── styles/                 # Additional styling
│   └── animations.css      # Custom animation definitions
└── utils/                  # Helper functions
    ├── email.ts            # Email sending utilities
    └── sound.ts            # Sound effect handlers
```

## 🎨 Customization Guide

The portfolio is designed with customization in mind. Here's how to adapt it to your needs:

### Theme Customization

| Component        | File Location        | Customization Options                                             |
| ---------------- | -------------------- | ----------------------------------------------------------------- |
| **Color Scheme** | `tailwind.config.ts` | Modify the theme colors, especially the primary green (`#2ed573`) |
| **Animations**   | `app/globals.css`    | Adjust timing, easing, and effects of animations                  |
| **Typography**   | `app/globals.css`    | Change font families, sizes, and weights                          |
| **UI Elements**  | `components/ui/*`    | Modify component styles and behaviors                             |

### Content Customization

| Content Type      | File Location            | Notes                                           |
| ----------------- | ------------------------ | ----------------------------------------------- |
| **Personal Info** | `app/dashboard/page.tsx` | Update profile information and social links     |
| **Skills**        | `data/skills.json`       | Add/remove skills and adjust proficiency levels |
| **Projects**      | `data/projects.json`     | Update project details, screenshots, and links  |
| **Blog Posts**    | `app/blog/page.tsx`      | Connect to your own blog or modify sample posts |

### Advanced Customization

For deeper customization, you can modify the React components directly. The codebase follows a modular structure, making it easy to identify and update specific features.

## 🌐 Deployment Options

| Platform                                      | Advantages                                                                 | Setup Guide                                                                    |
| --------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **[Vercel](https://vercel.com/)**             | Optimized for Next.js, automatic deployments, serverless functions support | [Vercel Deployment Guide](https://nextjs.org/docs/deployment)                  |
| **[Netlify](https://www.netlify.com/)**       | Easy setup, form handling, continuous deployment                           | [Netlify Next.js Guide](https://docs.netlify.com/frameworks/next-js/overview/) |
| **[GitHub Pages](https://pages.github.com/)** | Free for public repositories, simple setup                                 | Requires export configuration                                                  |
| **Self-hosted**                               | Complete control, custom server configurations                             | Deploy the built application to any Node.js server                             |

## 📝 License & Credits

This project is available under the [MIT License](LICENSE), which allows for both personal and commercial use with proper attribution.

### Acknowledgements

- **Frameworks**: [Next.js](https://nextjs.org/), [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Icons & UI**: [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)

## 📬 Contact Information

- **Email**: [e4rafat@gmail.com](mailto:e4rafat@gmail.com)
- **LinkedIn**: [linkedin.com/in/e4rafat](https://linkedin.com/in/e4rafat)
- **Website**: [profile.arafatbytes.live](https://profile.arafatbytes.live)

---

**Designed & Developed by Easin Arafat** | Application Security Engineer
