const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('sanket17', salt);
  // Deletes ALL existing entries
  await knex('user').del();
  await knex('user').insert([
    {
      id: 1,
      first_name: 'Sanket',
      last_name: 'Tikam',
      email: 'sankettikam17@gmail.com',
      contact_number: '8983764017',
      password: hashedPassword,
      is_admin: true,
      is_active: true,
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
};
