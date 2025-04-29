import axios from 'axios';
import { Task, TaskRequest, TaskStatus } from '../types/Task';

// Use a direct URL to the backend API
const API_URL = 'http://localhost:8080/tasks';

// Configure axios defaults
axios.defaults.timeout = 120000; // 120 seconds (2 minutes) timeout
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';

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
      const response = await axios.get<Task[]>(API_URL, {
        timeout: 120000 // 120 seconds (2 minutes) timeout specifically for this request
      });
      console.log('Tasks response:', response);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching tasks:', error);

      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out. The backend server might be unavailable.');
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error details:', error.response.data, error.response.status, error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from server:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
      }

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

      // Ensure the data is properly formatted for the API
      // Make sure the date is in the correct format expected by the backend
      const formattedData = {
        title: taskData.title.trim(),
        description: taskData.description ? taskData.description.trim() : "",
        status: taskData.status,
        // Ensure the date format matches the backend's expected format: yyyy-MM-dd'T'HH:mm
        dueDate: taskData.dueDate
      };

      console.log('Sending formatted data:', formattedData);

      // Add more detailed logging for debugging
      console.log('API URL:', API_URL);
      console.log('Request headers:', {
        'Content-Type': 'application/json'
      });

      const response = await axios.post<Task>(API_URL, formattedData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 120000 // 120 seconds (2 minutes) timeout specifically for this request
      });

      console.log('Create task response status:', response.status);
      console.log('Create task response data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating task:', error);

      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out. The backend server might be unavailable.');
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error details:', error.response.data, error.response.status, error.response.headers);

        // Log more detailed error information
        if (error.response.data && error.response.data.message) {
          console.error('Error message from server:', error.response.data.message);
        }
        if (error.response.data && error.response.data.errors) {
          console.error('Validation errors:', error.response.data.errors);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from server:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
      }

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
      console.log(`Updating task with ID ${id}:`, taskData);

      // Ensure the data is properly formatted for the API
      const formattedData = {
        title: taskData.title.trim(),
        description: taskData.description ? taskData.description.trim() : "",
        status: taskData.status,
        dueDate: taskData.dueDate
      };

      console.log('Sending formatted data:', formattedData);

      const response = await axios.put<Task>(`${API_URL}/${id}`, formattedData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 120000 // 120 seconds timeout
      });

      console.log('Update task response:', response.data);
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
