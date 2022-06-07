/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('user', (table) => {
    table.increments('id').primary();
    table.string('first_name').notNullable();
    table.string('last_name').nullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.bigInteger('contact_number').nullable();
    table.boolean('is_admin').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_deleted').defaultTo(false);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('user');
};
