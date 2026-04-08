const test = require('node:test');
const assert = require('node:assert/strict');

const { app } = require('./index');

test('GET / returns pipeline message', async () => {
  const server = app.listen(0);
  const address = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${address.port}/`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.equal(body, '🚀 CI/CD Pipeline is Working!');
  } finally {
    server.close();
  }
});

test('GET /health returns status payload', async () => {
  const server = app.listen(0);
  const address = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${address.port}/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, 'ok');
    assert.equal(typeof body.uptimeSeconds, 'number');
  } finally {
    server.close();
  }
});
