const supertest = require('supertest')

const app = require("../src/app")

test('Deve responder na raiz', async () => {
    const res = await supertest(app).get('/');
    expect(res.status).toBe(200);
});