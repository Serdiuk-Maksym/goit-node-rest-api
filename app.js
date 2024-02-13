import express from 'express';
import mongoose from 'mongoose';
import contactsRouter from './routes/contactsRouter';

const app = express();

mongoose.connect(
  'mongodb+srv://serdiukMO:Vfrc1992fcec@cluster0.z162u5v.mongodb.net/myDatabase/db-contacts/',
  {}
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error:'));
db.once('open', () => {
  console.log('Database connected successfully');
});

app.use('/api/contacts', contactsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
