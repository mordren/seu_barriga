const ValidationError = require('../errors/ValidationError')

module.exports = (app) => {

    const findAll = (filter = {}) => {
        return app.db('users').where(filter).select()
    }
   
    const save = async (user)  => {
        if (!user.name) throw new ValidationError('Nome é um atributo obrigatório')
        if (!user.mail) throw new ValidationError('Email é um atributo obrigatório')
        if (!user.passwd) throw new ValidationError('Senha é um atributo obrigatório')
       
        const userDB = await findAll({ mail: user.mail })
        if (Array.isArray(userDB) && userDB.length > 0) throw new ValidationError( 'Já existe um usuário com esse email')
       
        return await app.db('users').insert(user, '*');
    }
    return { findAll, save }
}
