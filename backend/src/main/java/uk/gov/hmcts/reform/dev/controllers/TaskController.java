package uk.gov.hmcts.reform.dev.controllers;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.hmcts.reform.dev.models.task.Task;
import uk.gov.hmcts.reform.dev.models.task.TaskRequest;
import uk.gov.hmcts.reform.dev.models.task.TaskStatusRequest;
import uk.gov.hmcts.reform.dev.services.TaskService;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@Slf4j
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * Get all tasks.
     *
     * @return List of all tasks
     */
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        log.info("Received request to get all tasks");
        List<Task> tasks = taskService.getAllTasks();
        log.info("Returning {} tasks", tasks.size());
        return ResponseEntity.ok(tasks);
    }

    /**
     * Get a task by ID.
     *
     * @param id Task ID
     * @return The task if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(taskService.getTaskById(id));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Create a new task.
     *
     * @param taskRequest Task data
     * @return The created task
     */
    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody TaskRequest taskRequest) {
        log.info("Received task creation request: {}", taskRequest);
        try {
            Task createdTask = taskService.createTask(taskRequest);
            log.info("Task created successfully: {}", createdTask);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        } catch (Exception e) {
            log.error("Error creating task: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Update a task.
     *
     * @param id Task ID
     * @param taskRequest Updated task data
     * @return The updated task
     */
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @Valid @RequestBody TaskRequest taskRequest) {
        try {
            Task updatedTask = taskService.updateTask(id, taskRequest);
            return ResponseEntity.ok(updatedTask);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Update only the status of a task.
     *
     * @param id Task ID
     * @param statusRequest New status
     * @return The updated task
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable Long id, @Valid @RequestBody TaskStatusRequest statusRequest) {
        try {
            Task updatedTask = taskService.updateTaskStatus(id, statusRequest.getStatus());
            return ResponseEntity.ok(updatedTask);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Delete a task.
     *
     * @param id Task ID
     * @return No content on success
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
