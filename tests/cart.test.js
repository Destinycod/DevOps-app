const request = require('supertest');
const app = require('../index'); 

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
