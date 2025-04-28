package uk.gov.hmcts.reform.dev.models.task;

import jakarta.validation.constraints.NotNull;

public class TaskStatusRequest {

    @NotNull(message = "Status is required")
    private TaskStatus status;

    // Default constructor
    public TaskStatusRequest() {
    }

    // Constructor with field
    public TaskStatusRequest(TaskStatus status) {
        this.status = status;
    }

    // Getter and Setter
    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }
}
