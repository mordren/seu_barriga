const request = require('supertest');

const mail = `${Date.now()}@mail.com`;

const app = require('../../src/app')


test('Deve listar todos os usuários', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty('name', 'Walter Mitral')
})

test('Deve inserir usuário com sucesso', async () => {
    const res = await request(app).post('/users').send({name:'Walter Mitral', mail, passwd:'123456'})
    expect(res.status).toBe(201)
    expect(res.body.name).toBe('Walter Mitral')
    expect(res.body).not.toHaveProperty('passwd')    
})

test('Deve armazenar uma senha criptografada', async () => {
    const res = await request(app).post('/users')
        .send({name:'Walter Mitral', mail: `${Date.now()}@mail.com`, passwd:'123456'})
    expect(res.status).toBe(201)
    const { id } = res.body
    const userDB = await app.services.user.findOne({ id })
    expect(userDB.passwd).not.toBeUndefined()
    expect(userDB.passwd).not.toBe('123456')

}) 

test('Não deve inserir usuário sem nome', async () => {
    const res = await request(app).post('/users')
        .send({ mail, passwd: '123555' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Nome é um atributo obrigatório');
})

test('Não deve inserir usuário sem email', async () => {
    const res = await request(app).post('/users')
        .send({name:"Walter Mitty", passwd: "123456"})
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Email é um atributo obrigatório')
})

test('Não deve inserir usuário sem senha', async () => {
    const res = await request(app).post('/users')
        .send({name:"Walter Mitty", mail: "123456"})
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Senha é um atributo obrigatório');
})

test('Não deve inserir usuário com email já existente', async () =>{
    const res = await request(app).post('/users').send({name:'Walter Mitral', mail, passwd:'123456'})
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Já existe um usuário com esse email')    
})

