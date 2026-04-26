<div align="center">
  <h1> Habit Tracker </h1>

![](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

<img src ="img/habit-tracker.png" width="80%">

</div>

## 💡 Overview

Habit Tracker is a full-stack web application for tracking daily habits over different time ranges.  
The application focuses on providing a clear and intuitive user experience while handling more complex logic behind the scenes, such as date consistency, navigation between time ranges, and preventing invalid user actions.

Users can track habits on a daily, weekly, and monthly level, as well as view a full-year overview for each habit. The system ensures that future dates cannot be interacted with, keeping the data consistent and realistic.

The project also emphasizes clean component structure, predictable state management, and reusable UI components.

## ✨ Features

- Daily, weekly, and monthly habit tracking views  
- Yearly overview for each habit (calendar-style)  
- Category-based filtering  
- Streak tracking  
- Completion statistics with visual progress indicator  
- Future dates are disabled (no navigation or logging into the future)  
- Clean and responsive UI  

## 🛠️ Tech Stack

- **React** – Frontend library for building the user interface  
- **TypeScript** – Type safety and better developer experience  
- **Tailwind CSS** – Utility-first styling  
- **Vite** – Fast development build tool
- **Node.js** – Runtime environment  
- **Express.js** – Backend framework for API handling  
- **Prisma** – ORM for database access  
- **MySQL** – Relational database for storing habits, logs and categories
- **ChatGPT** - AI-assisted support for brainstorming, debugging, code generation, refactoring, and documentation. All code was reviewed, tested, and finalized by the author.

## 📖 Sources

- [The Thiings Collection](https://www.thiings.co/things) Thiings images were converted for this project into svg format.

## 📦 Getting Started

To get a local copy of this project up and running, follow these steps.

### 🚀 Prerequisites

- **Node.js** (v16.x or higher) and **npm**.
- **Npm** 
- **MySQL** Latest version.

## 🛠️ Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/rosa-ammala/habit-tracker.git
   cd habit-tracker
   ```

2. **Install dependencies:**

   Using Npm:

   ```bash
   npm install
   ```

3. **Set up environment variables:**

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
   npx prisma migrate dev
   ```

6. **Creating Categories**
For full user experience the application requires categories to be created manually before use.

1. Install **Thunder Client** extension in VS Code  
2. Open Thunder Client  
3. Create a new request:
- **Method:** POST  
- **URL:** http://localhost:3000/api/categories

  ```json
   Create the following categories separately:

   {
     "name": "Health",
     "icon": "health.svg"
   }

   {
     "name": "Fitness",
     "icon": "dumbbell.svg"
   }

   {
     "name": "Learning",
     "icon": "book.svg"
   }

   {
     "name": "Hobby",
     "icon": "hobby.svg"
   }

   {
     "name": "Finance",
     "icon": "money.svg"
   }

   {
     "name": "Fitness",
     "icon": "dumbbell.svg"
   }
   ```

7. **Start the development server**
Run frontend and backend in separate terminals:

   ```bash
   npm run dev
   ```

## 📖 Usage

### ✔ Running the Application

- **Development mode:** `npm run dev`

> Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

## 🐛 Issues

Current limitations and areas under improvement:

- Habit edits do not update immediately without a page refresh
- View switch interaction issues on smaller screens when a modal is open
- User validation and error handling are limited in edge cases
- Occasional misclicks when interacting with day cells may trigger unintended navigation to the habit detail view

## 💡 Future Development

Potential future improvements and development ideas:

- Users can create and manage their own categories
- Habit analytics and insights (e.g. trends, completion rates over time)
- Improved mobile UX and layout optimizations