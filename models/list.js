const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");
const Project = require("./project");
const today = new Date();
const date = today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2);

const listSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project"
    },
    content: {
        type: String
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    check: {
        type: Boolean,
        default: false
    },
    start: {
        type: Date,
        default: date
    },
    end: {
        type: Date,
        default: date
    }
}, {
    timestamps: {
        createdAt: "createdAt"
    }
});

module.exports = mongoose.model("List", listSchema);