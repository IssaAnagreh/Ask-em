const bcrypt = require("bcrypt-nodejs");
const DB = require("../database/index");

const createUser = (req, res) => {
  const {
    firstName,
    midname,
    lastName,
    age,
    gender,
    country,
    email,
    username,
    password
  } = req.body;
  const hashedPassword = bcrypt.hashSync(req.body.password);

  DB.saveUser(
    username,
    firstName,
    midname,
    lastName,
    age,
    gender,
    country,
    email,
    hashedPassword,
    (err, result) => {
      if (result) {
        res.status(200).send({ done: 1 });
      } else {
        console.log(err);
        res.sendStatus(404);
      }
    }
  );
};

module.exports = createUser;
