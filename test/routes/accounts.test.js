const request = require('supertest');
const app = require('../../src/app')
const jwt = require('jwt-simple');

const MAIN_ROUT = '/v1/accounts'

let user
let user2

//aqui foi utilizado beforeEach para 

beforeEach(async () => {
    const res = await app.services.user.save({ name: 'User #1', mail: `${Date.now()}@mail.com`, passwd: '123456' });
    user = { ...res[0] };
    user.token = jwt.encode(user, 'Segredo!');
    const res2 = await app.services.user.save({ name: 'User #2', mail: `${Date.now()}@mail.com`, passwd: '123456' });
    user2 = { ...res2[0] };
})

test('Deve inserir uma conta com sucesso', async () =>{
    const res =  await request(app).post(MAIN_ROUT)
        .send({name:'#Acc 1'})
        .set('authorization', `bearer ${user.token}`)
    expect(res.status).toBe(201)
    expect(res.body.name).toBe('#Acc 1')
})

test('Não deve inserir uma conta sem nome', async () => {
    const res =  await request(app).post(MAIN_ROUT)
        .send({})
        .set('authorization', `bearer ${user.token}`)
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Nome é atributo necessário')
})

test('Não deve inserir uma conta de nome duplicado, para o mesmo usuário', () => {
    return app.db('accounts').insert({name: 'Acc duplicada', user_id: user.id})
        .then(()=> request(app).post(MAIN_ROUT)
            .set('authorization', `bearer ${user.token}`)
            .send({name: 'Acc duplicada'}))
        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Já existe uma conta com esse nome')
        })
})

test('Não deve retornar uma conta de outro usuário', () => {
    return app.db('accounts')
        .insert({ name: 'Acc User #2', user_id: user2.id }, ['id'])
        .then((acc) => request(app).get(`${MAIN_ROUT}/${acc[0].id}`)
            .set('authorization', `bearer ${user.token}`))
        .then((res) => {
            expect(res.status).toBe(403)
            expect(res.body.error).toBe('Você não pode acessar essa página')
        })
})

test('Não deve alterar uma conta de outro usuário', () => {
    return app.db('accounts')
        .insert({ name: 'Acc User #2', user_id: user2.id }, ['id'])
        .then((acc) => request(app).put(`${MAIN_ROUT}/${acc[0].id}`)
        .send({name:'Acc Updated'})
            .set('authorization', `bearer ${user.token}`))
        .then((res) => {
            expect(res.status).toBe(403)
            expect(res.body.error).toBe('Você não pode acessar essa página')
        })
})

test('Não deve remover uma conta de outro usuário', () => {
    return app.db('accounts')
        .insert({ name: 'Acc User #2', user_id: user2.id }, ['id'])
        .then((acc) => request(app).delete(`${MAIN_ROUT}/${acc[0].id}`)
           .set('authorization', `bearer ${user.token}`))
        .then((res) => {
            expect(res.status).toBe(403)
            expect(res.body.error).toBe('Você não pode acessar essa página')
        })
})


test('Deve listar apenas as contas do usuário', () => {
    return app.db('accounts').insert([
        {name: 'User Account #1', user_id: user.id},
        {name: 'User Account #2', user_id: user2.id},
    ])
    .then(() => request(app).get(MAIN_ROUT)
        .set('authorization', `bearer ${user.token}`)
    .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1)
        expect(res.body[0].name).toBe('User Account #1')
    }))
})

test('Deve retornar uma conta por ID', () =>{ 
    return app.db('accounts')
        .insert({name:'#Acc 3', user_id: user.id },  ['id'])        
        .then(acc => request(app).get(`${MAIN_ROUT}/${acc[0].id}`)
            .set('authorization', `bearer ${user.token}`))
        .then(res => {
            expect(res.status).toBe(200)
            expect(res.body.name).toBe('#Acc 3')
            expect(res.body.user_id).toBe(user.id)
        })
})

test('Deve alterar uma conta', () => {
    return app.db('accounts')
        .insert({name:'#Acc 3', user_id: user.id },  ['id'])        
        .then(acc => request(app).put(`${MAIN_ROUT}/${acc[0].id}`)
            .send({name:'Acc Updated'})
            .set('authorization', `bearer ${user.token}`))            
        .then(res => {
            expect(res.status).toBe(200)
            expect(res.body.name).toBe('Acc Updated')
        })
})

test('Deve remover uma conta', () => {
    var id;
    return  app.db('accounts')
        .insert({name:'#Acc 3', user_id: user.id },  ['id'])
        .then(acc => request(app).delete(`${MAIN_ROUT}/${acc[0].id}`)
            .set('authorization', `bearer ${user.token}`))
        .then(res =>{
            expect(res.status).toBe(204)
        })
})