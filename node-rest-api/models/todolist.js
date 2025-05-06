const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../database");

const ToDo = sequelize.define("ToDo", {
    id: {
        type: String,
        primaryKey: true,
        defaultValue: () => uuidv4(),
    },
    text: {
        type: String,
        allowNull: false,
        required:true
    },
    completed: {
        type: Boolean,
        defaultValue: false,
        required:true
    },
    userId: {
        type: String,
        allowNull: false,
        required: true
    }
});

module.exports = ToDo;