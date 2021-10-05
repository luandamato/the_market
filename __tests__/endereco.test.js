const request = require('supertest');
const app = require('../app.js')

describe('TESTES ENDERECO', ()=>{
    
    it('Get endereco do usuario', async()=>{
        const response = await request(app)
            .get('/enderecos/9')
            .send();
        
            expect(response.body.code).toBe(200)

    });

    it('Excluir endereco', async()=>{
        const response = await request(app)
            .get('/excluirEndereco')
            .send({id: 5});
        
        expect(response.body.code).toBe(200)

    });

})