const request = require ('supertest');

const app = require('../api');

describe('GET /healthz',() =>
{
    test('Tests if the server is healthy',async() =>
    {
        const response = await request(app).get("/healthz");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual("Server is up and running")
    });
});