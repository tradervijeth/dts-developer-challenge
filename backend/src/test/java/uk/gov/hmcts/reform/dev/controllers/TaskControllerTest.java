package uk.gov.hmcts.reform.dev.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uk.gov.hmcts.reform.dev.exceptions.GlobalExceptionHandler;
import uk.gov.hmcts.reform.dev.models.task.Task;
import uk.gov.hmcts.reform.dev.models.task.TaskRequest;
import uk.gov.hmcts.reform.dev.models.task.TaskStatus;
import uk.gov.hmcts.reform.dev.models.task.TaskStatusRequest;
import uk.gov.hmcts.reform.dev.services.TaskService;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class TaskControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TaskService taskService;

    @InjectMocks
    private TaskController taskController;

    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(taskController)
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();

        objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules(); // For proper LocalDateTime serialization
    }

    @Test
    public void getAllTasks_ShouldReturnAllTasks() throws Exception {
        // Arrange
        Task task1 = new Task("Task 1", "Description 1", TaskStatus.TODO, LocalDateTime.now().plusDays(1));
        task1.setId(1L);
        Task task2 = new Task("Task 2", "Description 2", TaskStatus.IN_PROGRESS, LocalDateTime.now().plusDays(2));
        task2.setId(2L);
        List<Task> tasks = Arrays.asList(task1, task2);

        when(taskService.getAllTasks()).thenReturn(tasks);

        // Act & Assert
        mockMvc.perform(get("/tasks"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[0].id", is(1)))
            .andExpect(jsonPath("$[0].title", is("Task 1")))
            .andExpect(jsonPath("$[1].id", is(2)))
            .andExpect(jsonPath("$[1].title", is("Task 2")));
    }

    @Test
    public void getTaskById_WithValidId_ShouldReturnTask() throws Exception {
        // Arrange
        Task task = new Task("Task 1", "Description 1", TaskStatus.TODO, LocalDateTime.now().plusDays(1));
        task.setId(1L);

        when(taskService.getTaskById(1L)).thenReturn(task);

        // Act & Assert
        mockMvc.perform(get("/tasks/1"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id", is(1)))
            .andExpect(jsonPath("$.title", is("Task 1")))
            .andExpect(jsonPath("$.description", is("Description 1")))
            .andExpect(jsonPath("$.status", is("TODO")));
    }

    @Test
    public void getTaskById_WithInvalidId_ShouldReturnNotFound() throws Exception {
        // Arrange
        when(taskService.getTaskById(999L)).thenThrow(new EntityNotFoundException("Task not found with ID: 999"));

        // Act & Assert
        mockMvc.perform(get("/tasks/999"))
            .andExpect(status().isNotFound());
    }

    @Test
    public void createTask_WithValidData_ShouldReturnCreatedTask() throws Exception {
        // Arrange
        TaskRequest taskRequest = new TaskRequest(
            "New Task",
            "New Description",
            TaskStatus.TODO,
            LocalDateTime.now().plusDays(1)
        );

        Task createdTask = new Task(
            taskRequest.getTitle(),
            taskRequest.getDescription(),
            taskRequest.getStatus(),
            taskRequest.getDueDate()
        );
        createdTask.setId(1L);

        when(taskService.createTask(any(TaskRequest.class))).thenReturn(createdTask);

        // Act & Assert
        mockMvc.perform(post("/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(taskRequest)))
            .andExpect(status().isCreated())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id", is(1)))
            .andExpect(jsonPath("$.title", is("New Task")))
            .andExpect(jsonPath("$.description", is("New Description")))
            .andExpect(jsonPath("$.status", is("TODO")));
    }

    @Test
    public void updateTask_WithValidIdAndData_ShouldReturnUpdatedTask() throws Exception {
        // Arrange
        TaskRequest taskRequest = new TaskRequest(
            "Updated Task",
            "Updated Description",
            TaskStatus.IN_PROGRESS,
            LocalDateTime.now().plusDays(2)
        );

        Task updatedTask = new Task(
            taskRequest.getTitle(),
            taskRequest.getDescription(),
            taskRequest.getStatus(),
            taskRequest.getDueDate()
        );
        updatedTask.setId(1L);

        when(taskService.updateTask(eq(1L), any(TaskRequest.class))).thenReturn(updatedTask);

        // Act & Assert
        mockMvc.perform(put("/tasks/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(taskRequest)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id", is(1)))
            .andExpect(jsonPath("$.title", is("Updated Task")))
            .andExpect(jsonPath("$.description", is("Updated Description")))
            .andExpect(jsonPath("$.status", is("IN_PROGRESS")));
    }

    @Test
    public void updateTask_WithInvalidId_ShouldReturnNotFound() throws Exception {
        // Arrange
        TaskRequest taskRequest = new TaskRequest(
            "Updated Task",
            "Updated Description",
            TaskStatus.IN_PROGRESS,
            LocalDateTime.now().plusDays(2)
        );

        when(taskService.updateTask(eq(999L), any(TaskRequest.class)))
            .thenThrow(new EntityNotFoundException("Task not found with ID: 999"));

        // Act & Assert
        mockMvc.perform(put("/tasks/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(taskRequest)))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateTaskStatus_WithValidIdAndStatus_ShouldReturnUpdatedTask() throws Exception {
        // Arrange
        TaskStatusRequest statusRequest = new TaskStatusRequest(TaskStatus.COMPLETED);

        Task updatedTask = new Task("Task 1", "Description 1", TaskStatus.COMPLETED, LocalDateTime.now().plusDays(1));
        updatedTask.setId(1L);

        when(taskService.updateTaskStatus(eq(1L), eq(TaskStatus.COMPLETED))).thenReturn(updatedTask);

        // Act & Assert
        mockMvc.perform(patch("/tasks/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(statusRequest)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id", is(1)))
            .andExpect(jsonPath("$.status", is("COMPLETED")));
    }

    @Test
    public void updateTaskStatus_WithInvalidId_ShouldReturnNotFound() throws Exception {
        // Arrange
        TaskStatusRequest statusRequest = new TaskStatusRequest(TaskStatus.COMPLETED);

        when(taskService.updateTaskStatus(eq(999L), eq(TaskStatus.COMPLETED)))
            .thenThrow(new EntityNotFoundException("Task not found with ID: 999"));

        // Act & Assert
        mockMvc.perform(patch("/tasks/999/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(statusRequest)))
            .andExpect(status().isNotFound());
    }

    @Test
    public void deleteTask_WithValidId_ShouldReturnNoContent() throws Exception {
        // Act & Assert
        mockMvc.perform(delete("/tasks/1"))
            .andExpect(status().isNoContent());
    }

    @Test
    public void deleteTask_WithInvalidId_ShouldReturnNotFound() throws Exception {
        // Arrange
        doThrow(new EntityNotFoundException("Task not found with ID: 999"))
            .when(taskService).deleteTask(999L);

        // Act & Assert
        mockMvc.perform(delete("/tasks/999"))
            .andExpect(status().isNotFound());
    }
}
