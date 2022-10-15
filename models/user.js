const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Project = require("./project");

const userSchema = new Schema({
    account: {
        type: String,
        require: true
    },
    password: {
        type: String
    },
    name: {
        type: String,
        require: true
    },
    avatar: {
        avatarPhoto: { type: String },
        deleteHash: { type: String }
    },
    project: [{
        type: Schema.Types.ObjectId,
        ref: "Project"
    }],
    lineAccessToken: {
        type: String
    },
    googleRefreshToken: {
        type: String
    }
});

userSchema.method({
    addProjectId: function (projectId) {
        this.project.push(projectId);
        return this.save();
    },
    removeProjectId: function (projectId) {
        this.project.pull(projectId);
        return this.save();
    }
});

module.exports = mongoose.model("User", userSchema);