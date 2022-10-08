import request from 'supertest';
import app from '../server.js';
import User from '../models/userModel.js';

beforeEach(() => {
  return User.deleteMany({});
});

async function postRequest(password) {
  return await request(app).post('/api/users/signup').send({
    name: 'mike',
    email: 'm@m.com',
    password: password,
  });
}

describe('User Signup', () => {
  it('should respond with 200 status code with correct credenntials', async () => {
    const response = await request(app).post('/api/users/signup').send({
      name: 'mike',
      email: 'm@m.com',
      password: 'Mikeymike1!',
    });
    expect(response.statusCode).toBe(200);
  });

  it('should have password be at least 8 characters', async () => {
    const response = await postRequest('Mikey1!');

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      'Password must be at least 8 characters'
    );
  });

  it('should have password with at least one number', async () => {
    const response = await postRequest('Mikeymike!');

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      'Password must contain at least one number'
    );
  });

  it('should have password with at least one uppercase letter', async () => {
    const response = await postRequest('mikeymike1!');

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      'Password must contain at least one uppercase'
    );
  });

  it('should have password with at least one special character', async () => {
    const response = await postRequest('Mikeymike1');

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      'Password must contain at least one special character'
    );
  });
});
