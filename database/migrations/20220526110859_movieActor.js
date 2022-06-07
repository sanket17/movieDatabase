/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('movie', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('banner').nullable();
      table.smallint('release_year').notNullable();
      table
        .enum('genre', [
          'action',
          'comedy',
          'horror',
          'romance',
          'thriller',
          'fantasy',
        ])
        .notNullable();
      table.string('director').notNullable();
      table.boolean('is_active').defaultTo(true);
      table.boolean('is_deleted').defaultTo(false);
      table.timestamps(true, true);
    })
    .createTable('actor', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.timestamps(true, true);
    })
    .createTable('movie_actor', (table) => {
      table.increments('id').primary();
      table.integer('movie_id').unsigned().notNullable();
      table.integer('actor_id').unsigned().notNullable();
      table.foreign('movie_id').references('movie.id');
      table.foreign('actor_id').references('actor.id');
      table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable('movie_actor')
    .dropTable('actor')
    .dropTable('movie');
};
