const request = require('supertest');
const app = require('../app.js')

describe('TESTES ENDERECO', ()=>{

    
    
    it('obter endereco do usuario', async()=>{
        const response = await request(app)
            .get('/enderecos/9')
            .send();
        
            expect(response.body.code).toBe(200)

    });

    

})