const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../database");

const User = sequelize.define("User", {
  id: {
    type: String,
    primaryKey: true,
    default: () => uuidv4(),
  },
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = User;
