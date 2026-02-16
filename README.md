# 🛡️ Incident Tracker

> A production-grade, full-stack incident management system engineered for performance, scalability, and maintainability.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-v16%2B-green)
![React](https://img.shields.io/badge/react-v18-blue)
![PostgreSQL](https://img.shields.io/badge/postgres-v12%2B-blue)

## 📖 Overview

The **Incident Tracker** is a robust web application designed to help engineering teams track, manage, and resolve production incidents efficiently. Built with a philosophy of "performance first," it leverages raw SQL for optimized database interactions and a clean, component-based frontend architecture.

This project demonstrates a production-ready application structure, featuring server-side pagination, advanced filtering, debounced search, and comprehensive error handling.

## 🏗️ System Architecture

The application follows a classic 3-tier architecture, ensuring separation of concerns and independent scalability of layers.

```mermaid
graph TD
    Client[Client Browser]
    LB[Load Balancer / Nginx]
    
    subgraph "Frontend Layer (React)"
        UI[User Interface]
        State[State Management]
        Router[React Router]
    end
    
    subgraph "Backend Layer (Node.js/Express)"
        API[API Gateway / Routes]
        Controller[Controllers]
        Service[Business Logic]
        DAL[Data Access Layer (Raw SQL)]
    end
    
    subgraph "Data Layer"
        DB[(PostgreSQL)]
    end

    Client --> UI
    UI --> Router
    Router --> |HTTP/REST| API
    API --> Controller
    Controller --> Service
    Service --> DAL
    DAL --> |SQL| DB
```

## ✨ Key Features

- **🚀 High-Performance Data Handling**: Implements server-side pagination and sorting to handle large datasets efficiently without bloating the client state.
- **🔍 Intelligent Search**: Features a debounced search mechanism (500ms) that queries title, summary, and owner fields across the database, minimizing unnecessary API load.
- **🛡️ Robust Validation**: Utilizes `express-validator` on the backend for strict input sanitization and custom validation logic on the frontend for immediate user feedback.
- **📊 Advanced Filtering**: precise filtering capabilities by Service, Severity (SEV1-SEV4), and Status, utilizing parameterized SQL queries for security and speed.
- **💎 Clean UI/UX**: A responsive interface built with modular CSS, featuring loading states, smooth transitions, and error toast notifications.

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | React 18 | Leverages the latest concurrent features and hooks for responsive UI. |
| | React Router v6 | Standard for declarative client-side routing. |
| | Axios | Intercepts requests/responses for centralized error handling. |
| | CSS Modules | Encapsulated styling to prevent global namespace pollution. |
| **Backend** | Node.js & Express | Non-blocking I/O model ideal for I/O-heavy applications like this. |
| | `pg` (node-postgres) | Lightweight PostgreSQL client. chosen over ORMs for raw performance and explicit query control. |
| | `express-validator` | Declarative validation chain processing. |
| **Database** | PostgreSQL | ACID compliant, relational integrity, and robust indexing support. |

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- PostgreSQL v12+
- npm v8+

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/incident-tracker.git
    cd incident-tracker
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    
    # Configure Environment
    cp .env.example .env
    # Update .env with your database credentials
    ```

3.  **Database Initialization**
    ```bash
    # Create the database using psql or your preferred tool
    psql -U postgres -c "CREATE DATABASE incident_tracker;"
    
    # The application handles table creation automatically on start.
    # To populate with dummy data:
    npm run seed
    ```

4.  **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application

**Development Mode:**
Open two terminal tabs:

**Tab 1 (Backend):**
```bash
cd backend
npm run dev
# Server runs on http://localhost:3001
```

**Tab 2 (Frontend):**
```bash
cd frontend
npm start
# App opens at http://localhost:3000
```

## 🧠 Engineering Decisions & Trade-offs

During the development of this system, several architectural decisions were made to prioritize performance and maintainability over development speed.

### 1. Raw SQL vs. ORM
**Decision:** We chose **Raw SQL** (via `pg`) over an ORM like Sequelize or TypeORM.
- **Reasoning:** While ORMs provide developer convenience, they often generate suboptimal queries (the N+1 problem) and abstract away the underlying database mechanics. By writing raw parameterized queries, we fully control query execution plans and index usage.
- **Trade-off:** Requires writing more boilerplate code but results in faster response times and predictable scaling.

### 2. Server-Side vs. Client-Side Pagination
**Decision:** Implemented **Server-Side Pagination**.
- **Reasoning:** Client-side pagination involves sending *all* records to the browser, which is acceptable for <1000 items but disastrous for scalability. Server-side pagination ensures the payload size remains constant (e.g., 2KB) regardless of whether there are 100 or 1,000,000 records.

### 3. Component Architecture
**Decision:** Functional Components with Custom Hooks.
- **Reasoning:** We separate *view* logic from *business* logic. API calls are abstracted into service layers, and complex state management is handled inside custom hooks, keeping the UI components pure and testable.

### 4. Database Indexing strategy
**Decision:** Added indexes on `status`, `severity`, and `service`.
- **Reasoning:** These are the high-cardinality columns used in the `WHERE` clauses for filtering. Without indexes, the database performs full sequential scans. With indexes, retrieval becomes O(log N).

## 📂 Project Structure

```bash
incident-tracker/
├── backend/
│   ├── src/
│   │   ├── config/         # DB Connection logic
│   │   ├── controllers/    # Request/Response handling
│   │   ├── middleware/     # Validation, Auth, Error handling
│   │   ├── models/         # Data Access Object (DAO) layer
│   │   ├── routes/         # API Endpoint definitions
│   │   └── seeders/        # Test data generation
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── services/       # API integration layer
│   │   └── App.js          # Root component & Routing
│   └── package.json
└── README.md
```

## 🔮 Future Roadmap

- **Telemetry & Observability:** Integrate OpenTelemetry for distributed tracing.
- **Authentication**: Implement JWT-based auth with Role-Based Access Control (RBAC).
- **Caching**: Introduce Redis to cache common query results (e.g., getting the list of unique services).
- **Testing**: Add Jest unit tests for the backend and Cypress E2E tests for the frontend.

## 👥 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

*Written by [Your Name] - Senior Software Engineer*