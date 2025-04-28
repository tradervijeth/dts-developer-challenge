package uk.gov.hmcts.reform.dev.services;

import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.hmcts.reform.dev.models.task.Task;
import uk.gov.hmcts.reform.dev.models.task.TaskRequest;
import uk.gov.hmcts.reform.dev.models.task.TaskStatus;
import uk.gov.hmcts.reform.dev.repositories.TaskRepository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    private Task task1;
    private Task task2;
    private TaskRequest taskRequest;

    @BeforeEach
    public void setup() {
        // Create test data
        task1 = new Task("Task 1", "Description 1", TaskStatus.TODO, LocalDateTime.now().plusDays(1));
        task1.setId(1L);
        
        task2 = new Task("Task 2", "Description 2", TaskStatus.IN_PROGRESS, LocalDateTime.now().plusDays(2));
        task2.setId(2L);
        
        taskRequest = new TaskRequest(
            "New Task",
            "New Description",
            TaskStatus.TODO,
            LocalDateTime.now().plusDays(1)
        );
    }

    @Test
    public void getAllTasks_ShouldReturnAllTasks() {
        // Arrange
        List<Task> expectedTasks = Arrays.asList(task1, task2);
        when(taskRepository.findAll()).thenReturn(expectedTasks);

        // Act
        List<Task> actualTasks = taskService.getAllTasks();

        // Assert
        assertThat(actualTasks).isEqualTo(expectedTasks);
    }

    @Test
    public void getTaskById_WithValidId_ShouldReturnTask() {
        // Arrange
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task1));

        // Act
        Task result = taskService.getTaskById(1L);

        // Assert
        assertThat(result).isEqualTo(task1);
    }

    @Test
    public void getTaskById_WithInvalidId_ShouldThrowEntityNotFoundException() {
        // Arrange
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> taskService.getTaskById(999L))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessageContaining("Task not found with ID: 999");
    }

    @Test
    public void createTask_ShouldSaveAndReturnTask() {
        // Arrange
        Task newTask = taskRequest.toTask();
        Task savedTask = new Task(
            taskRequest.getTitle(),
            taskRequest.getDescription(),
            taskRequest.getStatus(),
            taskRequest.getDueDate()
        );
        savedTask.setId(1L);

        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        // Act
        Task result = taskService.createTask(taskRequest);

        // Assert
        assertThat(result).isEqualTo(savedTask);
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    public void updateTask_WithValidId_ShouldUpdateAndReturnTask() {
        // Arrange
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task1));
        
        TaskRequest updateRequest = new TaskRequest(
            "Updated Task",
            "Updated Description",
            TaskStatus.IN_PROGRESS,
            LocalDateTime.now().plusDays(2)
        );
        
        Task updatedTask = new Task(
            updateRequest.getTitle(),
            updateRequest.getDescription(),
            updateRequest.getStatus(),
            updateRequest.getDueDate()
        );
        updatedTask.setId(1L);

        when(taskRepository.save(any(Task.class))).thenReturn(updatedTask);

        // Act
        Task result = taskService.updateTask(1L, updateRequest);

        // Assert
        assertThat(result.getTitle()).isEqualTo(updateRequest.getTitle());
        assertThat(result.getDescription()).isEqualTo(updateRequest.getDescription());
        assertThat(result.getStatus()).isEqualTo(updateRequest.getStatus());
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    public void updateTask_WithInvalidId_ShouldThrowEntityNotFoundException() {
        // Arrange
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> taskService.updateTask(999L, taskRequest))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessageContaining("Task not found with ID: 999");
    }

    @Test
    public void updateTaskStatus_WithValidId_ShouldUpdateStatusAndReturnTask() {
        // Arrange
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task1));
        
        Task updatedTask = new Task(task1.getTitle(), task1.getDescription(), TaskStatus.COMPLETED, task1.getDueDate());
        updatedTask.setId(1L);

        when(taskRepository.save(any(Task.class))).thenReturn(updatedTask);

        // Act
        Task result = taskService.updateTaskStatus(1L, TaskStatus.COMPLETED);

        // Assert
        assertThat(result.getStatus()).isEqualTo(TaskStatus.COMPLETED);
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    public void updateTaskStatus_WithInvalidId_ShouldThrowEntityNotFoundException() {
        // Arrange
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> taskService.updateTaskStatus(999L, TaskStatus.COMPLETED))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessageContaining("Task not found with ID: 999");
    }

    @Test
    public void deleteTask_WithValidId_ShouldDeleteTask() {
        // Arrange
        when(taskRepository.existsById(1L)).thenReturn(true);

        // Act
        taskService.deleteTask(1L);

        // Assert
        verify(taskRepository).deleteById(1L);
    }

    @Test
    public void deleteTask_WithInvalidId_ShouldThrowEntityNotFoundException() {
        // Arrange
        when(taskRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> taskService.deleteTask(999L))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessageContaining("Task not found with ID: 999");
    }
}
