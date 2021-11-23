const User = require('./src/models/User');
const Op = require('sequelize').Op
const helper = require('./src/helper.js');
const strategy = require('passport-local').Strategy

async function getUserById(id){
    try{
        const user = await User.findOne({
            where:{
                id,
            }
        })
        
        return user;

    } catch (error) {
        throw error
    }
    
}

async function getUser(username, senha){
    try{
        
        let crip = await helper.criptografar(senha);
        const user = await User.findOne({
            where:{
                senha: crip,
                [Op.or]: [
                    {
                        username: {
                            [Op.eq]: username
                        }
                    },
                    {
                        email: {
                            [Op.eq]: username
                        }
                    }
                ]
            }
        })

        return user;

    } catch (error) {
        throw error
    }
    
}


module.exports = function(passport){
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        try{
            const usuario = await getUserById(id)
            done(null, usuario)
        }
        catch (error) {
            console.log(error)
            done(error, null)
        }
    })

    passport.use(new strategy({
        usernameField: "username",
        passwordField: "senha"
    },
    async (username, password, done) => {
        try{
            const user = await getUser(username, password)
            
            if (!user) {
                return done(null, false)
            }
            else{
                return done(null, user)
            }
        }
        catch (error) {
            console.log(error)
            done(error, false)
        }
    }))

}