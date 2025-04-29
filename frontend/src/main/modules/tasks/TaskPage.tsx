import React from 'react';
import TaskList from './components/TaskList';

/**
 * Main Task Management page component
 */
const TaskPage: React.FC = () => {
  return (
    <div className="govuk-width-container task-page-container">
      <main className="govuk-main-wrapper" id="main-content" role="main">
        <div className="task-page-content">
          <TaskList />
        </div>
      </main>
    </div>
  );
};

export default TaskPage;
