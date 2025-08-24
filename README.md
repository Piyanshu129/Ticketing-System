# 🎫 Ticketing System

A full-stack **Ticketing System** that simulates real-world IT support or customer service workflows.  
Users can raise, manage, and resolve tickets, while admins and support agents have extended controls for management.

---

## 📌 Objective
Develop a ticketing system to:
- Allow users to create and manage support tickets.
- Provide role-based access control (User, Admin, Support Agent).
- Enable admins to manage users and tickets efficiently.

---

## 🧰 Tech Stack

### Backend
- **Java **
- **Spring Boot**
- **MySQL**

### Frontend
- **Next.js (React-based framework)**
- TailwindCSS (for UI styling)

---

## ✅ Must-Have Features

### 1. Authentication & Authorization
- Login & Logout functionality.
- Role-based access:
  - **User**: Manage own tickets.
  - **Support Agent**: Work on assigned tickets.
  - **Admin**: Manage users and all tickets.

### 2. User Dashboard
- Raise new tickets with subject, description, and priority.
- View all tickets created by the user.
- Comment on tickets.
- View ticket status (`Open`, `In Progress`, `Resolved`, `Closed`) and history.

### 3. Ticket Management
- Ticket lifecycle: `Open → In Progress → Resolved → Closed`.
- Reassign tickets (if role permits).
- Comment thread with timestamps and user info.
- Track ticket owner and assigned agent.

### 4. Admin Panel
- Manage users:
  - Add / Remove users.
  - Assign roles (Admin, Support Agent, User).
- Manage tickets:
  - View all tickets.
  - Force reassign or close tickets.
  - Monitor overall ticket statuses.

### 5. Access Control
- Only **Admins** can manage users and override tickets.
- **Support Agents** can update tickets they are assigned.
- **Users** can only manage their own tickets.

---

## 🌟 Good-to-Have Features

- **Email Notifications**: On ticket creation, assignment, or status change.
- **Search & Filter**: Search tickets by subject, status, priority, or user.
- **Ticket Prioritization**: Sort/filter by priority (`Low, Medium, High, Urgent`).
- **File Attachments**: Upload screenshots/documents.
- **Rate Ticket Resolution**: Allow users to rate ticket resolution (1–5 stars).

---

## 🚀 Getting Started

### Prerequisites
- Node.js & npm
- Java 17+
- MySQL

### Backend Setup
```bash
cd backend
./mvnw spring-boot:run
