const passport = require("passport");

const passportJwt = require('passport-jwt')

const secret = 'Segredo!'

module.exports = (app) =>{
    const params = {
        secrectOrKey : secret,
        jwtFromRequest = passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(), 
    }

    const 
}