const Project = require("../../models/project");
const List = require("../../models/list");
require("dotenv").config();

exports.addList = async (req, res, next) => {
    try {
        const user = req.user._id;
        const projectNum = req.params.projectnum;
        const content = req.body.newListInput;
        const dueDate = req.body.newListDueDate;
        const project = await Project.findOne({
            num: projectNum
        });
        const newList = await new List({
            project: project._id,
            content: content,
            creator: user,
            start: dueDate,
            end: dueDate
        }).save();
        await project.addListId(newList._id);

        res.status(200).json({
            newList: newList,
            listNum: project.list.length
        });

    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};

exports.editList = async (req, res, next) => {
    try {
        const content = req.body.editListInput;
        const listId = req.params.listId;
        const list = await List.findById(listId);

        list.content = content;
        await list.save();

        res.status(200).json({
            editStatus: list.content === content ? true : false
        });

    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};

exports.checkList = async (req, res, next) => {
    try {
        const listId = req.params.listId;
        const list = await List.findById(listId);
        const checkStatus = !list.check;
        list.check = checkStatus;
        await list.save();

        res.status(200).json({
            checkStatus: checkStatus
        });
    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};

exports.setDueDate = async (req, res, next) => {
    try {
        const listId = req.params.listId;
        const newDueDate = req.body.newDueDate;
        const list = await List.updateMany({
            _id: listId
        }, {
            start: newDueDate,
            end: newDueDate
        }).exec();

        res.status(200).json({
            setStatus: list.ok === 1 ? true : false
        });

    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};

exports.deleteList = async (req, res, next) => {
    try {
        const projectNum = req.params.projectnum;
        const listId = req.params.listId;
        const project = await Project.findOne({
            num: projectNum
        });
        const deleteList = await List.deleteOne({
            _id: listId
        }).exec();
        await project.removeListId(listId);

        res.status(200).json({
            deleteStatus: deleteList.deletedCount === 1 ? true : false,
            remainingListNum: project.list.length
        });
    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};