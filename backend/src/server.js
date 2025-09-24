const dotenv = require('dotenv');
const http = require('http');
const app = require('./app');
const { connectDatabase } = require('./config/db');

dotenv.config();

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDatabase();
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
