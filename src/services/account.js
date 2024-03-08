const ValidationError = require('../errors/ValidationError')

module.exports = (app) => {
    const findAll = (user_id) => {
        return app.db('accounts').where({user_id})
    }

    const find = (filter = {}) => {
        return app.db('accounts').where(filter).first()
    }

    const save = async (account) => {
        if (!account.name) throw new ValidationError('Nome é atributo necessário')

        const accDB = await find({name: account.name, user_id: account.user_id})

        if(accDB) throw new ValidationError('Já existe uma conta com esse nome')
        return app.db('accounts').insert(account, '*')
    };

    const update = (id, account) => {
        return app.db('accounts')
            .where({id})
            .update(account, '*') 
    }

    const remove = (id) => {
        return app.db('accounts')
            .where({id})
            .del()
    }

    return { save, findAll, find, update, remove}
}