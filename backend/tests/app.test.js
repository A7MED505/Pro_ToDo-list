const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Todo = require('../src/models/Todo');

let mongoServer;
let token;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test_secret_key';
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  await User.deleteMany({});
  await Todo.deleteMany({});
  token = undefined;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth and Todo APIs', () => {
  test('registers and logs in a user', async () => {
    const registerRes = await request(app).post('/api/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    expect(registerRes.statusCode).toBe(201);
    expect(registerRes.body.token).toBeDefined();

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'john@example.com',
      password: '123456',
    });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.user.email).toBe('john@example.com');
    expect(loginRes.body.token).toBeDefined();
  });

  test('creates and retrieves todos for authenticated user', async () => {
    const registerRes = await request(app).post('/api/auth/register').send({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: '123456',
    });

    token = registerRes.body.token;

    const createRes = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Finish project setup' });

    expect(createRes.statusCode).toBe(201);
    expect(createRes.body.todo.title).toBe('Finish project setup');

    const listRes = await request(app)
      .get('/api/todos')
      .set('Authorization', `Bearer ${token}`);

    expect(listRes.statusCode).toBe(200);
    expect(Array.isArray(listRes.body.todos)).toBe(true);
    expect(listRes.body.todos).toHaveLength(1);
  });
});
