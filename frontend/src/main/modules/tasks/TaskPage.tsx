import React from 'react';
import TaskList from './components/TaskList';

/**
 * Main Task Management page component
 */
const TaskPage: React.FC = () => {
  return (
    <div className="govuk-width-container">
      <main className="govuk-main-wrapper" id="main-content" role="main">
        <TaskList />
      </main>
    </div>
  );
};

export default TaskPage;
