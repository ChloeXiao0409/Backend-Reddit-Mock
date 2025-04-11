// Two Steps for encryption
// 1. Generate a hash using bcrypt.hashSync()
// 2. Validation for the hash with the plain text password using bcrypt.compareSync()

const bcrypt = require('bcryptjs');

const password = '123';

// const salt = bcrypt.genSaltSync();

// console.log(salt);

// Salt is radomly generated, but we define it for database validation using
const salt = "$2b$10$aWJCAJYK3/6l3IRg9mT64O";

const hashed = bcrypt.hashSync(password, salt);
console.log(hashed);
// $2b$10$yOfpgr2ZvpTjkJS5fx2XveufB3NkM6/JMDskVmmPifQflpAiVcTXK