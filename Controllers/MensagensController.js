const Mensagem = require('../src/models/Mensagem');
const User = require('../src/models/User');
const Op = require('sequelize').Op
const helper = require('../src/helper.js');

module.exports = {
    async getConversas(req, res){
        try{
            const required = {
                id: req.params.id
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);

            var { id } = req.params;

            const conversas = await Mensagem.findAll({
                where: {
                    [Op.or]: [
                        {
                            user_id: {
                                [Op.eq]: id
                            }
                        },
                        {
                            user2_id: {
                                [Op.eq]: id
                            }
                        }
                    ]
                },
                order: [
                    ['updated_at', 'DESC']
                ]
                
            })

            var ids = []
            console.log("entrando no for")
            conversas.forEach(function(c){
                if (c.user_id != id){
                    if (!ids.includes(c.user_id)){
                        ids.push(c.user_id)
                    }
                }
                else{
                    if (!ids.includes(c.user2_id)){
                        ids.push(c.user2_id)
                    }
                }
            })
            console.log("saiu do for\n"+ids)

            if (ids.length < 1){
                return helper.false_status(res, "nenhuma conversa encontrada");
            }

            const historico = await User.findAll({
                attributes: ['id','nome', 'username', 'foto'],
                where:{
                    id:{
                        [Op.in]: ids
                    }
                }
            })

            
            let msg = "sucesso";
            let body = {historico};
            return helper.true_status(res, body, msg);
        } catch (error) {
            throw error
        }
        
    },

    async getConversa(req, res){
        try{
            const required = {
                id: req.params.id,
                id2: req.params.id2,
            };
            const non_required = {};
            let requestdata = await helper.vaildObject(required, non_required, res);

            var { id, id2 } = req.params;

            const mensagens = await Mensagem.findAll({
                where: {
                    [Op.or]: [
                        {
                            [Op.and]: [
                                {
                                    user_id: {
                                        [Op.eq]: id
                                    }
                                },
                                {
                                    user2_id: {
                                        [Op.eq]: id2
                                    }
                                }
                            ]
                        },
                        {
                            [Op.and]: [
                                {
                                    user2_id: {
                                        [Op.eq]: id
                                    }
                                },
                                {
                                    user_id: {
                                        [Op.eq]: id2
                                    }
                                }
                            ]
                        }
                        
                    ]
                },
                order: [
                    ['updated_at', 'ASC']
                ]
                
            })

            
            let msg = "sucesso";
            let body = {mensagens};
            return helper.true_status(res, body, msg);
        } catch (error) {
            throw error
        }
        
    },

};