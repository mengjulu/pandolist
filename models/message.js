const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");
const Project = require("./project");

const messageSchema = new Schema({
    content: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project"
    }
}, {
    timestamps: {
        createdAt: "createdAt"
    }
});

module.exports = mongoose.model("Message", messageSchema);