const app = require('express')();
const consign = require('consign')
const knex = require('knex')
const knexfile = require('../knexfile.js')
const { TextEncoder, TextDecoder, isBuffer } = require("util");

//TODO criar chaveamento dinâmico.

app.db = knex(knexfile.test);

consign({cwd: 'src', verbose: false})
    .include('./config/passport.js')
    .include('./config/middlewares.js')
    .then('./services')
    .then('./routes')
    .then('./config/router.js')
    .into(app)

app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});

app.use((err, req, res, next) =>{
    const { name, message, stack } = err;
    //quando quiser ver um erro aqui vai ser prinntado:
    console.log(err)
    if (name === 'ValidationError') res.status(400).json({ error: message });
    if (name === 'RecursoIndevidoError') res.status(403).json({ error: message });
    
    else res.status(500).json({name, message, stack})
    next(err)
})

module.exports  = app