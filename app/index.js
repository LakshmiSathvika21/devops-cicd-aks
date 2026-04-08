const express = require('express');

const app = express();
const port = Number(process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.send('🚀 CI/CD Pipeline is Working!');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime())
  });
});

function startServer() {
  const server = app.listen(port, () => {
    console.log(`App running on port ${port}`);
  });

  const shutdown = () => {
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
