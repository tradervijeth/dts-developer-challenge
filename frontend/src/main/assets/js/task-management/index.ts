import React from 'react';
import { createRoot } from 'react-dom/client';
import TaskPage from '../../../modules/tasks/TaskPage';
import '../../../assets/scss/task-management.scss';

const root = createRoot(document.getElementById('task-management-root') as HTMLElement);
root.render(React.createElement(TaskPage));
