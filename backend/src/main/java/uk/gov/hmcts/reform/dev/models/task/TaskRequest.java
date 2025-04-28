package uk.gov.hmcts.reform.dev.models.task;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class TaskRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title cannot be more than 100 characters")
    private String title;

    @Size(max = 500, message = "Description cannot be more than 500 characters")
    private String description;

    @NotNull(message = "Status is required")
    private TaskStatus status;

    @NotNull(message = "Due date is required")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime dueDate;

    // Default constructor
    public TaskRequest() {
    }

    // Constructor with fields
    public TaskRequest(String title, String description, TaskStatus status, LocalDateTime dueDate) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.dueDate = dueDate;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    // Convert to Task entity
    public Task toTask() {
        return new Task(title, description, status, dueDate);
    }
}
