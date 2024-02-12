import mongoose from 'mongoose';

// Підключення до MongoDB за допомогою Mongoose
mongoose.connect(
  'mongodb+srv://serdiukMO:Vfrc1992fcec@cluster0.z162u5v.mongodb.net/',
  {}
);

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Database connection failed:', error);
  process.exit(1);
});

db.once('open', () => {
  console.log('Database connection successful');
});
