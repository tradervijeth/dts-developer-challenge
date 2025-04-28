# Task Management System Frontend

This is the frontend application for the HMCTS Task Management System.

## Overview

The frontend application is built using Express.js for server-side rendering with React components for the interactive user interface. It communicates with the backend API to perform CRUD operations on tasks.

## Technology Stack

- **Express.js**: Server-side rendering
- **React**: UI components
- **TypeScript**: Type safety
- **SCSS**: Styling
- **Axios**: API communication
- **Nunjucks**: Template rendering
- **Jest/Testing Library**: Component testing

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Yarn

### Installation

1. Install dependencies:

```bash
yarn install
```

### Running the Application

Development mode:

```bash
yarn build
yarn start:dev
```

Production mode:

```bash
yarn build:prod
yarn start
```

The application will be available at `http://localhost:3000`.

### Running Tests

```bash
yarn test
```

## Project Structure

```
frontend/
├── src/
│   ├── main/
│   │   ├── assets/
│   │   │   ├── js/
│   │   │   │   └── task-management/  # React entry point
│   │   │   └── scss/                 # Styles
│   │   ├── modules/
│   │   │   └── tasks/                # Task management components
│   │   │       ├── components/       # React components
│   │   │       └── TaskPage.tsx      # Main page component
│   │   ├── routes/                   # Express routes
│   │   ├── services/                 # API services
│   │   ├── types/                    # TypeScript types
│   │   └── views/                    # Nunjucks templates
│   └── test/                         # Tests
├── webpack/                          # Webpack configuration
└── README.md
```

## Features

### Task Management Dashboard

The main dashboard allows users to:

- View all tasks with filtering by status
- Create new tasks
- Edit existing tasks
- Delete tasks

### Task Properties

Each task has the following properties:

- **Title**: Required field, max 100 characters
- **Description**: Optional field, max 500 characters
- **Status**: One of "TODO", "IN_PROGRESS", or "COMPLETED"
- **Due Date**: Required date and time field

### Components

- **TaskList**: Main component that displays all tasks and handles CRUD operations
- **TaskCard**: Displays a single task with options to edit or delete
- **TaskForm**: Form for creating and editing tasks
- **DeleteConfirmation**: Confirmation dialog for deleting tasks

## API Integration

The frontend communicates with the backend API using the TaskService, which provides methods for:

- Getting all tasks
- Getting a task by ID
- Creating a new task
- Updating a task
- Updating a task's status
- Deleting a task

## Styling

The application uses SCSS for styling, with a focus on:

- Responsive design that works on mobile and desktop
- Clear visual hierarchy
- Consistent use of colors and spacing
- Accessibility

## Accessibility

The application follows accessibility best practices:

- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation
- Color contrast compliance
- Screen reader compatibility

## Testing

Components are tested using Jest and React Testing Library, focusing on:

- Component rendering
- User interactions
- API integration
- Error handling
