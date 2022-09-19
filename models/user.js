const connection = require("../config/db-config");
const argon2 = require("argon2");
const { calculateToken, checkAdmin } = require("../helpers/users");

const db = connection.promise();

const create = ({ username, email, password }) => {
  return hashPassword(password)
    .then((hashedPassword) => {
      return db.query("INSERT INTO admin SET ?", {
        username,
        email,
        hashedPassword,
      });
    })
    .then(([result]) => {
      const id = result.insertId;
      return { username, email, id };
    });
};

const update = async ({ email, password, token }) => {
  let sql = "UPDATE admin SET";
  const sqlValues = [];
  if (password) {
    sql += " hashedPassword = ?";
    sqlValues.push(await hashPassword(password));
  }
  if (email) {
    if (password) sql += ", email = ?";
    else sql += " email = ?";
    sqlValues.push(email);
  }
  sql += " WHERE id = 1";

  return db.query(sql, sqlValues).then((results) => results);
};

const findByEmail = (email) => {
  return db
    .query("SELECT * FROM admin WHERE email = ?", [email])
    .then(([results]) => results[0]);
};

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = (plainPassword) => {
  return argon2.hash(plainPassword, hashingOptions);
};

const verifyPassword = (plainPassword, hashedPassword) => {
  return argon2.verify(hashedPassword, plainPassword, hashingOptions);
};

module.exports = {
  create,
  update,
  findByEmail,
  hashPassword,
  verifyPassword,
};
