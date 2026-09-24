import 'dotenv/config';
import app from './app.js';
import connectDatabase from './config/database.js';

const port = process.env.PORT || 5000;

const start = async () => {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`Vaultrix API running on port ${port}`);
  });
};

start();
