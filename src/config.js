const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/SkillUp");

// check database is connected or not
connect.then(() => {
    console.log("Database connected successfully ...\n");
})
    .catch(() => {
        console.log("Database cannot be connected ...\n");
    });

// create a schema
const loginschema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const collection = new mongoose.model("logincredentials", loginschema);

module.exports = collection;