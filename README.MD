# TaskFlow Pro

TaskFlow Pro is a full-stack MERN productivity web application designed to help users manage daily tasks, organize plans, track progress, and stay productive through analytics and achievement-based motivation.

---

## Features

### Authentication

- User Signup
- User Login
- Secure Logout
- JWT Authentication with HTTP-only cookies

### Task Management

- Add new tasks
- Edit existing tasks
- Delete tasks
- Mark tasks as completed
- Automatically mark overdue tasks as failed
- Filter tasks by:
  - All
  - Pending
  - Completed
  - Failed

### Plans Management

- Create plans
- Track active plans
- View completed plans
- Progress tracking system

### Dashboard Analytics

- Total tasks overview
- Completed tasks count
- Pending tasks count
- Failed tasks count
- Active plans summary
- Completed plans summary
- Task completion donut chart
- Active plans progress bars

### Achievement System

- Task streak tracking
- Achievement badges
- Achievement levels:
  - Bronze
  - Silver
  - Gold
  - Diamond
  - Master

### UI/UX

- Fully responsive design
- Mobile sidebar navigation
- Clean dashboard layout
- Interactive charts and statistics

---

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- React Router DOM
- Recharts
- React Icons
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Cookie Parser
- CORS

---

## Project Structure

```bash
TaskFlow-Pro/
│
├── FRONT_END/
│   ├── src/
│   ├── public/
│   └── .env
│
├── BACK_END/
│   ├── models/
│   ├── routes/
│   └── .env
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/AhmadMansoor764/TaskFlow-Pro.git
cd TaskFlow-Pro
```

### Install Frontend Dependencies

```bash
cd FRONT_END
npm install
npm run dev
```

### Install Backend Dependencies

```bash
cd BACK_END
npm install
npm start
```

---

## Environment Variables

### Frontend `.env`

```env
VITE_API_URL=your_backend_url
```

### Backend `.env`

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## Future Improvements

- Dark mode
- Notifications/reminders
- Calendar integration
- Drag and drop task management
- Task priority levels
- Email reminders

---

## Live Demo

Frontend: Coming Soon  
Backend: Coming Soon

---

## Author

**Ahmad Mansoor**

GitHub: https://github.com/AhmadMansoor764
