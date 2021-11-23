module.exports = {
    async home(req, res) {
        console.log("home")
        res.render('Home.html');
    },

    async chat(req, res) {
        res.render('Chat.html');
    },

    async login(req, res) {
        console.log("redirecionando pro login")
        res.render('Login.html');
    },

    async json(req, res) {
        console.log('json')
        res.json({nome: "Luan"});
    }
}