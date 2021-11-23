const request = require('supertest');
const app = require('../app.js')

describe('TESTES PRODUTOS', ()=>{
    
    it('cadastrar', async () => {
        var nome = "produto teste"
        var descricao = "descricao produto teste"
        var preco = "34,60"
        var usado = "false"
        var desativar_ao_vender = "true"
        var anunciante_id = 8

        const response = await request(app)
            .post('/produto')
            .send({ nome, descricao, preco, usado, desativar_ao_vender, anunciante_id});

        expect(response.body.code).toBe(200)
    });

    it('obter todos os produtos (home)', async()=>{
        const response = await request(app)
            .get('/produtos')
            .send();
        
        expect(response.body.code).toBe(200)

    });

    it('obter produto (detalhes do produto)', async()=>{
        const response = await request(app)
            .get('/produto/1')
            .send();
        
        expect(response.body.code).toBe(200)

    });

    it('obter todos produto cadastrados por um usuario especifico', async()=>{
        const response = await request(app)
            .get('/user/produtos/18')
            .send();
        
        expect(response.body.code).toBe(200)

    });

})