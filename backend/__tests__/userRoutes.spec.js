import request from 'supertest';
import app from '../server.js';
import User from '../models/userModel.js';

beforeEach(() => {
  return User.deleteMany({});
});

afterEach(async () => {
  return await User.deleteMany({});
});

async function postUserAndPasswordIs(password) {
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

  it('saves the name and email to database', async () => {
    await postUserAndPasswordIs('Mikeymike1!');
    const userList = await User.find();
    expect(userList.length).toBe(1);
  });

  it('hashes the password in database', async () => {
    await postUserAndPasswordIs('Mikeymike1!');
    const userList = await User.find();
    const savedUser = userList[0];
    expect(savedUser.password).not.toBe('Mikeymike1!');
  });

  describe('User validation errors, that is not password validation', () => {
    it('should return error message if at least 3 characters long', async () => {
      const response = await request(app).post('/api/users/signup').send({
        name: 'mi',
        email: 'm@m.com',
        password: 'Mikeymike1!',
      });
      expect(response.body.message).toBe(
        'User validation failed: name: Name must be at least 3 characters long'
      );
    });
  });

  describe('Check for password requirements', () => {
    test.each`
      password         | expectedMessage
      ${'Mikey1!'}     | ${'Password must be at least 8 characters'}
      ${'Mikeymike!'}  | ${'Password must contain at least one number'}
      ${'mikeymike1!'} | ${'Password must contain at least one uppercase'}
      ${'Mikeymike1'}  | ${'Password must contain at least one special character'}
    `(
      'returns $expectedMessage when password is invalid',
      async ({ password, expectedMessage }) => {
        const response = await postUserAndPasswordIs(password);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe(expectedMessage);
      }
    );
  });
});
