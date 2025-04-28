import { Application } from 'express';

export default function (app: Application): void {
  app.get('/task-management', (req, res) => {
    res.render('tasks', {
      pageTitle: 'Task Management System',
      pageDescription: 'Manage your tasks efficiently'
    });
  });

  // Redirect /tasks to /task-management to avoid conflict with API
  app.get('/tasks', (req, res) => {
    res.redirect('/task-management');
  });
}
