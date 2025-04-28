package uk.gov.hmcts.reform.dev.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uk.gov.hmcts.reform.dev.models.task.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // Spring Data JPA automatically provides CRUD operations
    // We can add custom query methods here if needed
}
