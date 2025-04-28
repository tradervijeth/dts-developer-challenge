import { Application } from 'express';

export default function (app: Application): void {
  app.get('/', async (req, res) => {
    try {
      // Redirect to the tasks page
      res.redirect('/tasks');
    } catch (error) {
      console.error('Error:', error);
      res.render('home', {});
    }
  });
}
