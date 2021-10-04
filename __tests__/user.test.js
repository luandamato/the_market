const request = require('supertest');
const app = require('../app.js')

describe('testes usuario', ()=>{
    

    it('Login', async()=>{
        const response = await request(app)
            .post('/login')
            .send({ username: "luan", senha: "123"});
        
            expect(response.body.code).toBe(200)

    }),

    it('Registro (vai falahar por ja ter no BD)', async ()=>{
        const response = await request(app)
            .post('/user')
            .send({ nome: "cadastrado pelos testes",
            nascimento: "2000-08-24",
            cpf: "123456",
            email: "teste@email",
            telefone: "123987",
            username: "teste testes",
            senha: "123",
            bio: "bio de testes"});
        
        expect(response.body.status).toBe(200)

    })

    it('Get', async ()=>{
        const response = await request(app)
            .get('/user/1')
            .send();
        
        expect(response.body.status).toBe(200)


        
    })

})