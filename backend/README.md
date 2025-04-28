# Task Management System API

This is the backend API for the HMCTS Task Management System.

## Getting Started

### Prerequisites

- Java 17 or higher
- Gradle

### Running the Application

```bash
./gradlew bootRun
```

The API will be available at `http://localhost:8080`.

### Running Tests

```bash
./gradlew test
```

## API Documentation

### Base URL

```
http://localhost:8080/api
```

### Endpoints

#### Get All Tasks

```
GET /api/tasks
```

Retrieves all tasks.

Response:

```json
[
  {
    "id": 1,
    "title": "Complete case review",
    "description": "Review case files for upcoming hearing",
    "status": "TODO",
    "dueDate": "2023-04-30T10:00:00",
    "createdAt": "2023-04-01T12:00:00",
    "updatedAt": "2023-04-01T12:00:00"
  },
  ...
]
```

#### Get Task by ID

```
GET /api/tasks/{id}
```

Retrieves a specific task by ID.

Response:

```json
{
  "id": 1,
  "title": "Complete case review",
  "description": "Review case files for upcoming hearing",
  "status": "TODO",
  "dueDate": "2023-04-30T10:00:00",
  "createdAt": "2023-04-01T12:00:00",
  "updatedAt": "2023-04-01T12:00:00"
}
```

#### Create Task

```
POST /api/tasks
```

Creates a new task.

Request Body:

```json
{
  "title": "Complete case review",
  "description": "Review case files for upcoming hearing",
  "status": "TODO",
  "dueDate": "2023-04-30T10:00:00"
}
```

Response:

```json
{
  "id": 1,
  "title": "Complete case review",
  "description": "Review case files for upcoming hearing",
  "status": "TODO",
  "dueDate": "2023-04-30T10:00:00",
  "createdAt": "2023-04-01T12:00:00",
  "updatedAt": "2023-04-01T12:00:00"
}
```

#### Update Task

```
PUT /api/tasks/{id}
```

Updates an existing task.

Request Body:

```json
{
  "title": "Complete case review",
  "description": "Review case files for upcoming hearing and prepare notes",
  "status": "IN_PROGRESS",
  "dueDate": "2023-05-01T10:00:00"
}
```

Response:

```json
{
  "id": 1,
  "title": "Complete case review",
  "description": "Review case files for upcoming hearing and prepare notes",
  "status": "IN_PROGRESS",
  "dueDate": "2023-05-01T10:00:00",
  "createdAt": "2023-04-01T12:00:00",
  "updatedAt": "2023-04-01T13:00:00"
}
```

#### Update Task Status

```
PATCH /api/tasks/{id}/status
```

Updates only the status of a task.

Request Body:

```json
{
  "status": "COMPLETED"
}
```

Response:

```json
{
  "id": 1,
  "title": "Complete case review",
  "description": "Review case files for upcoming hearing",
  "status": "COMPLETED",
  "dueDate": "2023-04-30T10:00:00",
  "createdAt": "2023-04-01T12:00:00",
  "updatedAt": "2023-04-01T14:00:00"
}
```

#### Delete Task

```
DELETE /api/tasks/{id}
```

Deletes a task.

Response: 204 No Content

### Status Values

The following status values are supported:

- `TODO`: Task is not yet started
- `IN_PROGRESS`: Task is in progress
- `COMPLETED`: Task is completed

### Error Responses

The API returns appropriate HTTP status codes and error messages:

#### Not Found (404)

```json
{
  "timestamp": "2023-04-01T12:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Task not found with ID: 999"
}
```

#### Validation Error (400)

```json
{
  "timestamp": "2023-04-01T12:00:00",
  "status": 400,
  "error": "Validation Error",
  "errors": {
    "title": "Title is required",
    "dueDate": "Due date is required"
  }
}
```

## Data Validation

The API validates input data and returns appropriate error messages.

- **Title**: Required, max 100 characters
- **Description**: Optional, max 500 characters
- **Status**: Required, must be one of: "TODO", "IN_PROGRESS", "COMPLETED"
- **Due Date**: Required, must be a valid date

## Database

The application uses an in-memory H2 database for development. The H2 console is enabled and available at `/h2-console` with the following parameters:

- JDBC URL: `jdbc:h2:mem:taskdb`
- Username: `sa`
- Password: (leave empty)
