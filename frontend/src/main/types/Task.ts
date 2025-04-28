/**
 * Enum representing task status values
 */
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

/**
 * Interface for task data from the API
 */
export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for task request data for creating or updating tasks
 */
export interface TaskRequest {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: string;
}

/**
 * Interface for status update request
 */
export interface StatusRequest {
  status: TaskStatus;
}
