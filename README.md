# LinkedIn Clone

A full-stack LinkedIn-inspired social networking application built with **React.js, Node.js, Express.js, and PostgreSQL**.

## 🚀 Project Overview

This project is a LinkedIn clone designed to demonstrate core professional networking features such as user profiles, posts, followers, connections, messaging, and job-related information.

The application follows a full-stack architecture:

**React.js → Node.js/Express.js → PostgreSQL**

## 🛠️ Technologies Used

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* React Hooks
* REST API integration

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* PostgreSQL
* SQL

### Development Tools

* Git
* GitHub
* VS Code
* Postman

## ✨ Features

### 👤 User Profile

* View user profile
* Display name and profile image
* Display headline
* Display follower count
* Display user information

### 📝 Posts

* Create posts
* Read posts
* Display post description
* Display post author
* Display post date
* Like posts
* Comment on posts

### 👥 Followers & Connections

* Follow users
* Display follower count
* Manage connections
* View connected users

### 💬 Messaging

* Send messages
* Receive messages
* Display sender and receiver
* Display message timestamp
* Read conversation history

### 💼 Jobs

* Display job information
* View company details
* View job location
* Display job-related information

### 📄 Documents

* Upload/store user-related documents
* Display document information where required

## 📂 Project Structure

```text
linkedin-clone/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── db.js
│   ├── server.js
│   └── package.json
│
├── database/
│   └── schema.sql
│
└── README.md
```

## 🔄 Data Flow

```text
React Frontend
      ↓
REST API
      ↓
Node.js + Express
      ↓
PostgreSQL
      ↓
Database Data
      ↓
React UI
```

## 🔌 API Examples

### Get Users

```http
GET /api/users
```

### Get Posts

```http
GET /api/posts
```

### Get User Profile

```http
GET /api/users/:id
```

### Get Messages

```http
GET /api/messages/:userId
```

## 🗄️ Database Tables

The application can use tables such as:

```text
users
posts
comments
likes
followers
connections
messages
jobs
documents
notifications
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd linkedin-clone
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

```bash
cd ../backend
npm install
```

### 4. Configure PostgreSQL

Create a PostgreSQL database and configure the backend environment variables.

Example:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=linkedin_clone
DB_USER=postgres
DB_PASSWORD=your_password
```

### 5. Start the backend

```bash
npm start
```

Backend:

```text
http://localhost:5000
```

### 6. Start the frontend

Open another terminal:

```bash
cd frontend
npm start
```

The React application will run on the configured frontend port.

## 🧪 Testing

API endpoints can be tested using **Postman**.

Example:

```text
GET http://localhost:5000/api/users
GET http://localhost:5000/api/posts
```

## 🐛 Current Development Focus

* Fix duplicate messages appearing in conversations
* Display complete post descriptions
* Display follower information correctly
* Connect React frontend with Node.js backend
* Connect Node.js backend with PostgreSQL
* Read and display database data in the React UI
* Test the complete frontend-to-backend flow

## 🎯 Future Improvements

* User authentication
* JWT-based authorization
* Profile editing
* Image upload
* Real-time messaging
* Notifications
* Advanced job search
* Search users and posts
* Responsive mobile design
* Deployment to production

## 📌 Project Status

**Status:** In Development

This project is being developed as a full-stack learning project to understand **React.js, Node.js, REST APIs, PostgreSQL, Git, and full-stack application development**.

## 👨‍💻 Developer

**Sujith A**

M.Sc Computer Science
Aspiring Software Developer | Data Science & AI Enthusiast
