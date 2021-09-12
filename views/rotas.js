module.exports = {
    async home(req, res) {
        res.render('Home.html');
    },

    async chat(req, res) {
        res.render('chat.html');
    },

    async json(req, res) {
        console.log('json')
        res.json({nome: req.params.nome});
    }
}