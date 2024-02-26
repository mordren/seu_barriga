const supertest = require('supertest')

const request = supertest('http://localhost:3001');
test('Deve responder a porta 3001', async () => {
    //acessar a url http://localhost:3001
    await request.get('/').then(res => expect(res.status).toBe(200));
    //verificar que a resposta 
});