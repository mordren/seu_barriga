const request = require('supertest');
const app = require('../../src/app')

const MAIN_ROUT = '/accounts'

let user;

beforeAll(async () => {
    const res = await request(app).post('/users').send({name:'José do Pulo', mail: `${Date.now()}@mail.com`, passwd:'123456'})
    //força o user ser renomeado aqui. clonando
    user = {... res.body}
})

test('Deve inserir uma conta com sucesso', async () =>{
    const res =  await request(app).post(MAIN_ROUT).send({name:'#Acc 1', user_id: user.id });
    expect(res.status).toBe(201)
    expect(res.body.name).toBe('#Acc 1')
})

test('Não deve inserir uma conta sem nome', async () => {
    const res =  await request(app).post(MAIN_ROUT).send({user_id: user.id });
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Nome é atributo necessário')
})

test('Deve listar todas as contas', () => {
    return app.db('accounts').insert({name:'#Acc 2', user_id: user.id })
        .then(() => request(app).get(MAIN_ROUT))
        .then(res =>{
            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThan(0)
        })
})

test('Deve retornar uma conta por ID', () =>{ 
    return app.db('accounts').insert({name:'#Acc 3', user_id: user.id },  ['id'])
        .then(acc => request(app).get(`${MAIN_ROUT}/${acc[0].id}`))
        .then(res => {
            expect(res.status).toBe(200)
            expect(res.body.name).toBe('#Acc 3')
            expect(res.body.user_id).toBe(user.id)
        })
})

test('Deve alterar uma conta', () => {
    return app.db('accounts').insert({name:'#Acc 3', user_id: user.id },  ['id'])
        .then(acc => request(app).put(`${MAIN_ROUT}/${acc[0].id}`)
            .send({name:'Acc Updated'}))
        .then(res => {
            expect(res.status).toBe(200)
            expect(res.body.name).toBe('Acc Updated')
        })
})

test('Deve remover uma conta', () => {
    var id;
    return  app.db('accounts').insert({name:'#Acc 3', user_id: user.id },  ['id'])
        .then(acc => request(app).delete(`${MAIN_ROUT}/${acc[0].id}`))
        .then(res =>{
            expect(res.status).toBe(204)
        })
})