/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('actor').del();
  await knex('actor').insert([
    {
      name: 'Will Smith',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'John Doe',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Robbin Williams',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Christopher Nolan',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Chinmay Mandlekar',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Digpal Lanjekar',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Ajay Purkar',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Aayushmaan Khurana',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Akshay Kumar',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Sunil Shetty',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Siddharth Malhotra',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Sanjay Bansali',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Alia Bhatt',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Vidya Balan',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Irfaan Khan',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
};
