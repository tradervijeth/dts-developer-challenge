import { Application } from 'express';

export default function (app: Application): void {
  app.get('/tasks', (req, res) => {
    res.render('tasks', {
      pageTitle: 'Task Management System',
      pageDescription: 'Manage your tasks efficiently'
    });
  });
}
