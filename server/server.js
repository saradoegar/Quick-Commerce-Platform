const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment configurations relative to the current directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = require('./app');
const connectDatabase = require('./config/db');

const PORT = process.env.PORT || 5000;

// Initialize Database connection then launch the HTTP listener
connectDatabase()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Success: Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

    // Graceful Termination Process Handlers
    const shutdown = () => {
      console.log('SIGTERM/SIGINT signal received. Terminating database connection and HTTP listener gracefully...');
      server.close(() => {
        console.log('HTTP listener stopped.');
        mongoose.connection.close(false).then(() => {
          console.log('Database connection terminated.');
          process.exit(0);
        });
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  })
  .catch((error) => {
    console.error(`Application Bootup Error: ${error.message}`);
    process.exit(1);
  });
