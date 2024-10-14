//jest.mock('@sentry/profiling-node');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index'); 

let server;
let timeoutVariable, intervalVariable;

beforeAll(() => {
  server = app.listen();
});

afterAll(() => {
  // Cierra el servidor y otros manejadores abiertos
  if (server) server.close();

  // Si tienes Sentry u otras conexiones, asegúrate de cerrarlas también
  if (typeof Sentry !== 'undefined') {
    Sentry.close();
  }

  // Si tienes intervalos o timeouts
  if (timeoutVariable) clearTimeout(timeoutVariable);
  if (intervalVariable) clearInterval(intervalVariable);
});

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  const uri = server.getUri();

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  //server = app.listen();
});

afterAll(async () => {
  //await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await server.stop();
});

describe('Cart API', () => {
  let cartId;

  it('should create a new cart', async () => {
    const res = await request(app)
      .post('/api/carts')
      .send({
        userId: 'testuser123',
        products: [{ productId: 'product123', quantity: 2 }],
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    cartId = res.body._id;
  },10000);

  it('should update a cart', async () => {
    const res = await request(app)
      .put(`/api/carts/${cartId}`)
      .send({
        products: [{ productId: 'product123', quantity: 3 }],
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.products[0].quantity).toBe(3);
  });

  it('should get all carts', async () => {
    const res = await request(app).get('/api/carts');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
