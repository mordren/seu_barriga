
const app = require("../app")
const express = require('express')

const RecursoIndevidoError = require('../errors/RecursoIndevidoError');


module.exports = (app) => {
    const router = express.Router()

    router.param('id', (req, res, next) => {
        app.services.account.find({id: req.params.id})
            .then((acc) => {
                if (acc.user_id !== req.user.id) throw new RecursoIndevidoError()
                else next()
        }).catch(err => next(err));
    })
   
    router.post('/', async (req, res, next) => {
        try{
            const result = await app.services.account
                .save({... req.body, user_id: req.user.id})
            return res.status(201).json(result[0])
        }catch(err){
            return next(err)
        }
    })

    router.get('/', (req, res) => {
        app.services.account.findAll(req.user.id)
        .then(result => {
            res.status(200).json(result)
        })
    })

    router.get('/:id', (req, res, next) => {
        app.services.account.find({id: req.params.id })
        .then((result) => res.status(200).json(result)
        ).catch(err => next(err))
    })

    router.put('/:id', (req, res) => {
        app.services.account.update(req.params.id, req.body)
            .then(result => res.status(200).json(result[0]))
    })

    router.delete('/:id', (req, res) => {
        app.services.account.remove(req.params.id)
            .then(() => res.status(204).send())
    })

    return router
}