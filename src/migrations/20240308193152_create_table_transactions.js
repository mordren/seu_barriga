/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('transactions', (t) =>{
        t.increments('id').primary
        t.string('description').notNull()
        t.enu('type', ['I', 'O']).notNull()
        t.date('date').notNull()
        t.decimal('amount').notNull()
        t.boolean('status').notNull().defaultTo(false)
        t.integer('acc_id')
            .references('id')
            .inTable('accounts')
            .notNull()
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('transactions')  
};
