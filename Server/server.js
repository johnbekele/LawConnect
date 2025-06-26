import express from 'express';
import app from './app.js'; // Import the app instance from app.js

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});