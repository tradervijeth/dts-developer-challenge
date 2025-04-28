package uk.gov.hmcts.reform.dev.services;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uk.gov.hmcts.reform.dev.models.task.Task;
import uk.gov.hmcts.reform.dev.models.task.TaskRequest;
import uk.gov.hmcts.reform.dev.models.task.TaskStatus;
import uk.gov.hmcts.reform.dev.repositories.TaskRepository;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    /**
     * Get all tasks.
     *
     * @return List of all tasks
     */
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    /**
     * Get a task by ID.
     *
     * @param id Task ID
     * @return The task if found
     * @throws EntityNotFoundException if task not found
     */
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Task not found with ID: " + id));
    }

    /**
     * Create a new task.
     *
     * @param taskRequest Task data
     * @return The created task
     */
    public Task createTask(TaskRequest taskRequest) {
        Task task = taskRequest.toTask();
        return taskRepository.save(task);
    }

    /**
     * Update a task.
     *
     * @param id Task ID
     * @param taskRequest Updated task data
     * @return The updated task
     * @throws EntityNotFoundException if task not found
     */
    public Task updateTask(Long id, TaskRequest taskRequest) {
        Task existingTask = getTaskById(id);
        
        existingTask.setTitle(taskRequest.getTitle());
        existingTask.setDescription(taskRequest.getDescription());
        existingTask.setStatus(taskRequest.getStatus());
        existingTask.setDueDate(taskRequest.getDueDate());
        
        return taskRepository.save(existingTask);
    }

    /**
     * Update only the status of a task.
     *
     * @param id Task ID
     * @param status New status
     * @return The updated task
     * @throws EntityNotFoundException if task not found
     */
    public Task updateTaskStatus(Long id, TaskStatus status) {
        Task existingTask = getTaskById(id);
        existingTask.setStatus(status);
        return taskRepository.save(existingTask);
    }

    /**
     * Delete a task.
     *
     * @param id Task ID
     * @throws EntityNotFoundException if task not found
     */
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new EntityNotFoundException("Task not found with ID: " + id);
        }
        taskRepository.deleteById(id);
    }
}
