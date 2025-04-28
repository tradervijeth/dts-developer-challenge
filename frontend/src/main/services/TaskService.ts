import axios from 'axios';
import { Task, TaskRequest, TaskStatus } from '../types/Task';

// Use a relative URL to the backend API (will be proxied through Express)
const API_URL = '/api/tasks';

/**
 * Service for interacting with the Task Management API
 */
export class TaskService {
  /**
   * Get all tasks
   * @returns Promise containing an array of tasks
   */
  static async getAllTasks(): Promise<Task[]> {
    try {
      console.log('Fetching tasks from:', API_URL);
      const response = await axios.get<Task[]>(API_URL);
      console.log('Tasks response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      console.error('Error details:', error.response?.data, error.response?.status, error.response?.headers);
      throw error;
    }
  }

  /**
   * Get a task by ID
   * @param id Task ID
   * @returns Promise containing task object
   */
  static async getTaskById(id: number): Promise<Task> {
    try {
      const response = await axios.get<Task>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new task
   * @param taskData Task data to create
   * @returns Promise containing created task object
   */
  static async createTask(taskData: TaskRequest): Promise<Task> {
    try {
      console.log('Creating task with data:', taskData);
      const response = await axios.post<Task>(API_URL, taskData);
      console.log('Create task response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Error creating task:', error);
      console.error('Error details:', error.response?.data, error.response?.status, error.response?.headers);
      throw error;
    }
  }

  /**
   * Update a task
   * @param id Task ID to update
   * @param taskData Updated task data
   * @returns Promise containing updated task object
   */
  static async updateTask(id: number, taskData: TaskRequest): Promise<Task> {
    try {
      const response = await axios.put<Task>(`${API_URL}/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error(`Error updating task with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update task status
   * @param id Task ID
   * @param status New status
   * @returns Promise containing updated task object
   */
  static async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    try {
      const response = await axios.patch<Task>(`${API_URL}/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating status of task with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a task
   * @param id Task ID to delete
   * @returns Promise resolving to void
   */
  static async deleteTask(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting task with ID ${id}:`, error);
      throw error;
    }
  }
}
