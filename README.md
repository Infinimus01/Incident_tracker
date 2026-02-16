# Incident Tracker

A full-stack incident management system built with React, Node.js, and PostgreSQL.

## Setup & Run Instructions

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update `.env` with your PostgreSQL credentials
4. Start the server (this will also initialize the database tables):
   ```bash
   npm run dev
   ```
5. (Optional) Seed the database with test data:
   ```bash
   npm run seed
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```
   The app will run at `http://localhost:3000`.

## API Overview

Base URL: `http://localhost:3001/api`

### Incidents
- `GET /incidents` - List incidents with pagination and filtering
- `POST /incidents` - Create a new incident
- `GET /incidents/:id` - Get details of a specific incident
- `PATCH /incidents/:id` - Update an incident
- `DELETE /incidents/:id` - Delete an incident

### Services
- `GET /services` - Get a list of unique services

## Design Decisions & Trade-offs

### Raw SQL (pg) vs. ORM
- **Decision**: Used `pg` library for direct SQL queries instead of an ORM (like Sequelize/TypeORM).
- **Trade-off**: More boilerplate code, but significantly better performance and fine-grained control over query execution, avoiding N+1 problems common with ORMs.

### Server-Side Pagination
- **Decision**: Implemented pagination on the backend.
- **Trade-off**: Slightly increased complexity in API and frontend state management, but ensures scalability. Client-side pagination creates performance bottlenecks with large datasets.

### Debounced Search
- **Decision**: Implemented a 500ms debounce on search inputs.
- **Trade-off**: User sees results with a slight delay, but prevents API flooding and database overload during rapid typing.

## Future Improvements

With more time, I would add:
- **Testing**: Unit tests (Jest) for backend logic and E2E tests (Cypress) for critical user flows.
- **Authentication**: JWT-based authentication to secure endpoints and support user roles.
- **Caching**: Redis implementation to cache frequently accessed data like service lists.
- **Docker**: Containerize the application for consistent deployment environments.
- **CI/CD**: Github Actions workflow for automated testing and linting.