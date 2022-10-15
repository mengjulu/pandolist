const Project = require("../../models/project");
const User = require("../../models/user");
const List = require("../../models/list");
const Message = require("../../models/message");

exports.addProject = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const projectName = req.body.projectName;
        const num = Math.floor(Date.now() * Math.random());
        const project = await Project.exists({
            num: num
        });

        const newProject = await new Project({
            name: projectName,
            creator: userId,
            num: project ? Math.floor(Date.now() * Math.random()) : num
        }).save();

        await newProject.addAuth(user);
        res.status(200).json({
            newProject: newProject
        });

    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};

exports.changeTitle = async (req, res, next) => {
    try {
        const newTitle = req.body.newTitle;
        const projectNum = req.body.projectNum;
        const project = await Project.findOne({
            num: projectNum
        });

        project.name = newTitle;
        await project.save();

        res.status(200).json({
            projectName: project.name
        });

    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};

exports.addProjectAuth = async (req, res, next) => {
    try {
        const projectId = req.body.projectId;
        const userToBeAdd = req.body.userToBeAdd.trim();
        const project = await Project.findById(projectId);
        const user = await User.findOne({
            account: {
                "$regex": userToBeAdd,
                "$options": "i"
            }
        });
        if (!user) {
            res.status(404).json({
                addAuthStatus: "No user"
            });
        } else if (project.auth.includes(user._id)) {
            res.status(400).json({
                addAuthStatus: "User exist"
            })
        } else {
            await project.addAuth(user);
            res.status(200).json({
                addAuthStatus: "Success"
            });
    }
} catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};

exports.removeProjectAuth = async (req, res, next) => {
    try {
        const projectId = req.body.projectId;
        const userToBeRemove = req.body.userToBeRemove;
        const user = await User.findOne({
            account: userToBeRemove
        });

        const project = await Project.findById(projectId);
        await project.removeAuth(user);
        res.status(200).json({
            removeAuthStatus: user.project.includes(projectId) || project.auth.includes(user._id) ? false : true
        });
    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};

exports.deleteProject = async (req, res, next) => {
    try {
        const projectId = req.body.projectId;
        const project = await Project.findById(projectId);
        const projectAuth = project.auth;

        await projectAuth.map(async (auth) => {
            const user = await User.findById(auth);
            user.removeProjectId(projectId);
        });
        await List.deleteMany({
            project: projectId
        }).exec();

        await Message.deleteMany({
            project: projectId
        }).exec();

        const projectDelete = await Project.deleteOne({
                _id: projectId
            })
            .exec();
        res.status(200).json({
            deleteStatus: projectDelete.deletedCount === 1 ? true : false
        });
    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};