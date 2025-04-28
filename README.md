# HMCTS Task Management System

This is a full-stack application built for the HMCTS Developer Technical Test. The system allows caseworkers to efficiently create, track, and manage their tasks.

## Project Overview

This monorepo contains both the backend API and frontend application:

- `backend/`: Spring Boot API with JPA/Hibernate and H2 in-memory database
- `frontend/`: Express.js application with React components

## Features

### Task Management
- Create tasks with title, description, status, and due date
- View all tasks with filtering by status
- Update existing tasks
- Delete tasks when no longer needed

### Task Properties
- **Title**: Required field, max 100 characters
- **Description**: Optional field, max 500 characters
- **Status**: One of "TODO", "IN_PROGRESS", or "COMPLETED"
- **Due Date**: Required date field

## Technology Stack

### Backend
- **Spring Boot**: For the REST API
- **JPA/Hibernate**: For ORM and database interactions
- **H2 Database**: In-memory database for development
- **JUnit**: For unit testing

### Frontend
- **Express.js**: Server-side rendering
- **React**: Client-side UI components
- **TypeScript**: Type safety
- **SCSS**: Styling
- **Jest/Testing Library**: For component testing

## Getting Started

### Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- Yarn

### Running the Backend

```bash
cd backend
./gradlew bootRun
```

The API will be available at `http://localhost:8080`.

### Running the Frontend

```bash
cd frontend
yarn install
yarn build
yarn start:dev
```

The application will be available at `http://localhost:3000`.

## Testing

### Backend Tests

```bash
cd backend
./gradlew test
```

### Frontend Tests

```bash
cd frontend
yarn test
```

## API Documentation

### Base URL

```
http://localhost:8080/api
```

### Endpoints

- `GET /api/tasks`: Get all tasks
- `GET /api/tasks/{id}`: Get a specific task
- `POST /api/tasks`: Create a new task
- `PUT /api/tasks/{id}`: Update a task
- `PATCH /api/tasks/{id}/status`: Update a task's status
- `DELETE /api/tasks/{id}`: Delete a task

Detailed API documentation is available in the backend README.md file.

## Frontend Routes

- `/tasks`: Task Management Dashboard

## Implementation Details

### Backend

The backend follows a layered architecture:
- **Controllers**: Handle HTTP requests and responses
- **Services**: Implement business logic
- **Repositories**: Interact with the database
- **Models**: Define the data structure

### Frontend

The frontend uses:
- **Express.js**: For server-side rendering
- **React**: For client-side components
- **Components**: TaskList, TaskCard, TaskForm, DeleteConfirmation
- **Services**: API communication layer
