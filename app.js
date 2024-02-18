import express from 'express';
import mongoose from 'mongoose';
import contactsRouter from './routes/contactsRouter.js';

const app = express();

const DB_HOST =
  'mongodb+srv://Serdiuk:Vfrc1992@cluster0.xc0qx8y.mongodb.net/db-contacts?retryWrites=true&w=majority';

mongoose.connect(DB_HOST, {});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error:'));
db.once('open', () => {
  console.log('Database connected successfully');
});

app.use('/api/contacts', contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log('Server is running. Use our API on port: 3000');
});
