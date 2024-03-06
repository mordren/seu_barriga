const request = require('supertest');

const app = require('../../src/app')

test('O usuário deve receber um token ao logar', () => {
    const mail = `${Date.now()}@mail.com`
    return app.services
        .save({name:'Walter Mitral', passwd:'123456'})
        .then(() => request.app(app).post('/auth/signin'))
        .send({mail, passwd : '123456'})
        .then((res) => {
            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('token')
        } )
})