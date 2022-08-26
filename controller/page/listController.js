const Project = require("../../models/project");
const User = require("../../models/user");
const Message = require("../../models/message");
require("dotenv").config();

exports.listpage = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("project");
        const projectNum = req.params.projectnum;
        const sortParams = req.query.sort;
        const today = new Date();
        const date = today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2);
        const messageDate = new Intl.DateTimeFormat("locales", {
            dateStyle: "short",
            timeStyle: "short"
        });
        const sort = sortParams === "alphabetical" ? {
                "content": 1
            } :
            sortParams === "due" ? {
                "end": 1
            } :
            sortParams === "check" ? {
                "check": 1
            } : {
                "createdAt": 1
            };

        const thisProject = await Project.findOne({
                num: projectNum,
                auth: req.user._id
            })
            .populate({
                path: "auth",
                populate: {
                    path: "user"
                }
            })
            .populate({
                path: "list",
                options: {
                    sort: sort
                }
            });

        const messages = await Message.find({
            project: thisProject?._id
        }).populate({
            path: "user",
            select: "account avatar"
        });
        !thisProject ?
            res.status(200).render("error", {
                title: "Sorry! ;(",
                offCanvasProject: user.project,
                errorMessage: "Oops! The project is not existed or you are not authorized."
            }) :
            res.status(200).render("list/listpage", {
                title: `Pandolist: ${thisProject.name}`,
                offCanvasProject: user.project,
                date: date,
                thisProject: thisProject,
                lists: thisProject.list,
                users: thisProject.auth,
                messages: messages,
                messageDate: messageDate,
                csrfToken: req.csrfToken()
            })

    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};