EduHub – Online Learning Platform (Frontend)

EduHub is a modern Online Learning Management System (LMS) frontend built using React + Vite.
It provides a clean, scalable, and user-friendly interface for students, instructors, and administrators to manage and consume educational content.

This frontend communicates with a Spring Boot backend using Axios and follows a feature-based architecture for maintainability and scalability.

🚀 Project Overview

EduHub allows users to:

Browse and enroll in courses

Watch video lessons and access PDF resources

Track learning progress

Submit feedback and ratings

Manage courses and users (Admin/Instructor)

Access role-based dashboards

The project is designed to be simple, fast, and interview-ready, avoiding unnecessary over-engineering.

🛠 Tech Stack

Frontend Framework: React (Vite)

Language: JavaScript (ES6+)

Routing: React Router DOM

API Handling: Axios

State Management: React Hooks & Context API

Styling: CSS / Bootstrap (optional)

Build Tool: Vite

📁 Project Folder Structure
eduhub-frontend/
│
├── index.html
├── package.json
├── vite.config.js
├── .env
├── README.md
│
├── public/
│   └── favicon.svg
│
└── src/
    ├── api/                          # Axios API handlers
    │   ├── axiosInstance.js
    │   ├── auth.api.js
    │   ├── course.api.js
    │   ├── enrollment.api.js
    │   ├── content.api.js
    │   ├── feedback.api.js
    │   └── payment.api.js
    │
    ├── assets/                       # Static assets
    │   ├── images/
    │   ├── icons/
    │   └── styles/
    │
    ├── components/                   # Reusable components
    │   ├── common/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Loader.jsx
    │   │   └── ProtectedRoute.jsx
    │   └── course/
    │       └── CourseCard.jsx
    │
    ├── context/                      # Global Context
    │   └── AuthContext.jsx
    │
    ├── features/                     # Feature-based modules
    │   ├── auth/
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   │
    │   ├── courses/
    │   │   ├── CourseCatalog.jsx
    │   │   └── CourseDetails.jsx
    │   │
    │   ├── classroom/
    │   │   └── Classroom.jsx
    │   │
    │   ├── feedback/
    │   │   └── FeedbackForm.jsx
    │   │
    │   └── admin/
    │       └── AdminDashboard.jsx
    │
    ├── hooks/                        # Custom hooks
    │   ├── useAuth.js
    │   └── useFetch.js
    │
    ├── layouts/                      # Layout wrappers
    │   ├── PublicLayout.jsx
    │   └── StudentLayout.jsx
    │
    ├── pages/                        # Generic pages
    │   ├── Home.jsx
    │   ├── Unauthorized.jsx
    │   └── NotFound.jsx
    │
    ├── routes/
    │   └── AppRoutes.jsx
    │
    ├── utils/
    │   └── formatDate.js
    │
    ├── App.jsx
    ├── main.jsx
    └── index.css

🔐 Authentication & Authorization

Authentication is handled using JWT

Token is stored in localStorage

Role-based access is implemented using ProtectedRoute

Roles supported:

Student

Admin

Instructor

🔗 Backend Integration

All API calls are handled via Axios

A centralized Axios instance is used with interceptors

Backend base URL is configured using environment variables

.env
VITE_API_BASE_URL=http://localhost:8080/api

▶️ How to Run the Project
1️⃣ Clone the Repository
git clone <your-repo-url>
cd eduhub-frontend

2️⃣ Install Dependencies
npm install

3️⃣ Start Development Server
npm run dev

4️⃣ Open in Browser
http://localhost:5173

📌 Design Decisions

No Redux or external state libraries (kept simple)

Feature-based folder structure for scalability

Axios for clean API separation

React Context used only for authentication

🎯 Future Enhancements

Course assessments and quizzes

Certificate generation

Payment gateway integration

Analytics dashboards

Instructor-specific tools