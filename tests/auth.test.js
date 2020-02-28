require('dotenv').config();
const request = require('supertest');
const app = require('../app');

beforeAll(() => {
});

describe('Auth Endpoints', () => {
    it('should fail creating a new user', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                name: "weber",
                email: 'weber@epitech.eu',
            });
        expect(res.statusCode).toEqual(422);
    }),
    it('should create a new user', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                name: "weber",
                email: 'weber@epitech.eu',
                password: "mysecretpassword"
            });
        expect(res.statusCode).toEqual(200);
    })
});

