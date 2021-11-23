const request = require('supertest');
const app = require('../app.js')

describe('testes usuario', ()=>{
    

    it('Login', async()=>{
        const response = await request(app)
            .post('/login')
            .send({ username: "luan", senha: "1234"});
        
            expect(response.body.code).toBe(200)

    }),


    it('obter usuario', async ()=>{
        const response = await request(app)
            .get('/user/1')
            .send();
        
        expect(response.body.code).toBe(200)


        
    })

})