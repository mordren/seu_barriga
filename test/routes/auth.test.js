const request = require('supertest');

const app = require('../../src/app')


test('Deve criar um usuário via signup', () =>{
    return request(app).post('/auth/signup')
        .send({name:'Walter Mitral', mail: `${Date.now()}@mail.com`, passwd:'123456'})
        .then((res) => {
            expect(res.status).toBe(201)
            expect(res.body.name).toBe('Walter Mitral')
            expect(res.body).toHaveProperty('mail')
            expect(res.body).not.toHaveProperty('passwd')
        })
})

test('O usuário deve receber um token ao logar', () => {
    const mail = `${Date.now()}@mail.com`
    return app.services.user.save(
        {name:'Walter Mitral', mail, passwd:'123456'})
    .then(() => request(app).post('/auth/signin')
        .send({mail, passwd : '123456'}))
    .then((res)=>{
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('token')
    })
})

test('Não deve autenticar usuário com senha incorreta', () =>{
    const mail = `${Date.now()}@mail.com`
    return app.services.user.save(
        {name:'Walter Mitral', mail, passwd:'123456'})
    .then(() => request(app).post('/auth/signin')
        .send({mail, passwd : '654321'}))
    .then((res)=>{        
        expect(res.status).toBe(400)
        expect(res.body.error).toBe('Usuário ou senha inválido')
    })
})

test('Não deve autenticar usuário inexistente', () => {
    return request(app).post('/auth/signin')
        .send({mail:"não existe", passwd : '12345'})
        .then((res) => {
            expect(res.status).toBe(400) 
            expect(res.body.error).toBe('Usuário ou senha inválido') 
        })
})

test('Não deve ser possível acessar uma rota sem token', () =>{
    return request(app).get('/v1/users')
        .then((res) => {
            expect(res.status).toBe(401)
        })
})