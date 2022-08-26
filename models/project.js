const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");
const List = require("./list");

const projectSchema = new Schema({
    num: {
        type: String,
        unique: true
    },
    name: {
        type: String
    },
    list: [{
        type: Schema.Types.ObjectId,
        ref: "List"
    }],
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    auth: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
}, {
    timestamps: {
        createdAt: "createdAt"
    }
})

projectSchema.method({
    addAuth: function (user) {
        this.auth.push(user._id);
        user.addProjectId(this._id);
        return this.save();
    },
    removeAuth: function (user) {
        this.auth.pull(user._id);
        user.removeProjectId(this._id);
        return this.save();
    },
    addListId: function (listId) {
        this.list.push(listId);
        return this.save();
    },
    removeListId: function (listId) {
        this.list.pull(listId);
        return this.save();
    }
});

module.exports = mongoose.model("Project", projectSchema);