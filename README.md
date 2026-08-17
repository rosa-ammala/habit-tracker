<div align="center">
  <h1> Habit Tracker </h1>

![](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![](https://custom-icon-badges.demolab.com/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)

<img src ="img/home-page-week-view.png" width="80%">

</div>

## 💡 Overview

Habit Tracker is a full-stack web application for tracking daily habits over different time ranges. The application focuses on providing a clear and intuitive user experience while handling more complex logic behind the scenes, such as date consistency, navigation between time ranges, and preventing invalid user actions.

Users can track habits on a daily, weekly, and monthly level, as well as view a full-year overview for each habit. The system ensures that future dates cannot be interacted with, keeping the data consistent and realistic.

The project also emphasizes clean component structure, predictable state management, and reusable UI components.

## ✨ Features

- Create, edit, and delete habits
- Daily, weekly, and monthly habit tracking views
- Yearly overview for each habit (calendar-style)
- Category-based filtering
- Backend-calculated current and best streaks
- Completion statistics with visual progress indicator
- Future dates are disabled (no navigation or logging into the future)
- Optimistic habit log updates for immediate UI feedback
- Clean and responsive UI

## 🛠️ Tech Stack

- **React** – Frontend library for building the user interface  
- **TypeScript** – Type safety and better developer experience  
- **Redux Toolkit + RTK Query** – UI state management, API fetching, caching, and optimistic habit log updates
- **Tailwind CSS** – Utility-first styling  
- **Vite** – Fast development build tool
- **Node.js** – Runtime environment  
- **Express.js** – Backend framework for API handling  
- **Prisma** – ORM for database access  
- **MySQL** – Relational database for storing habits, logs and categories
- **Codex/ChatGPT** - AI-assisted support for brainstorming, debugging, code generation, refactoring, and documentation. All code was reviewed, tested, and finalized by the author.

Testing:
- **Vitest** – Unit and integration-style tests for frontend utilities, Redux state, RTK Query cache behavior, and backend logic
- **Supertest** – Backend API route testing against the Express app
- **Testing Library** – React component tests focused on user-visible behavior and interactions
- **Playwright + axe** – Browser smoke tests and accessibility checks for the main user flows

## 📖 Sources

- [The Thiings Collection](https://www.thiings.co/things) Thiings images were converted for this project into svg format.

## 📦 Getting Started

To get a local copy of this project up and running, follow these steps.

### 🚀 Prerequisites

- **Node.js** (v20 or higher) and **npm**
- **MySQL** installed and running locally

## 🛠️ Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/rosa-ammala/habit-tracker.git
   cd habit-tracker
   ```

2. **Install dependencies:**

   Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

   Install frontend dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

3. **Set up the database:**

  - Make sure MySQL is running locally
  - Create a new database called 'habits_db'

4. **Set up environment variables:**

   Create a `.env` file in the backend directory and add the following variables:

   ```env
   DB_PASSWORD="your_password"
   DATABASE_URL="mysql://root:your_password@localhost:3306/habits_db"
   ```

   Replace:
    - DB_PASSWORD with your MySQL password (also inside the DATABASE_URL)

5. **Run Prisma migrations**

   Ensure your database is running and you're inside the backend folder:

   ```bash
   cd ../backend
   npx prisma migrate dev
   ```

6. **Seed categories**

   For the full user experience, seed the default categories before using the app.
   Ensure you're inside the backend folder:

   ```bash
   npm run seed
   ```

7. **Start the development server**
  Run frontend and backend in separate terminals.

  Backend:

   ```bash
   cd backend
   npm run dev
   ```

  Frontend:

   ```bash
   cd frontend
   npm run dev
   ```

## 📖 Usage

### ✔ Running the Application

Run the backend and frontend development servers in separate terminals:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

> Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

### ✔ Running Tests

Frontend:

```bash
cd frontend
npm run test:run
npm run test:e2e
```

Backend:

```bash
cd backend
cp .env.test.example .env.test
npm run test:db:migrate
npm test
```

## 🐛 Issues

Current limitations and areas under improvement:

- The app does not yet include user accounts or authentication
- Categories are seeded by the backend instead of being managed through the UI
- Habit logs are currently fetched as full history instead of year-based API queries
- Form validation and error handling are intentionally lightweight for the MVP

## 💡 Future Development

Potential future improvements and development ideas:

- User accounts and authentication
- User-owned habits and categories
- Category management in the UI
- Habit schedules and habit goals
- Analytics and insights, such as trends and completion rates over time
- Year-based habit log queries for larger log histories
- Continued mobile UX and accessibility improvements
