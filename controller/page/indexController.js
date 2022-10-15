const Project = require("../../models/project");
const User = require("../../models/user");
const List = require("../../models/list");

exports.indexPage = async (req, res, next) => {
    try {
        if (req.user) {
            const user = await User.findById(req.user._id)
                .populate("project");
            const ownList = await List.find({
                creator: req.user._id
            }).populate("project");
            res.status(200).render("index/index-auth", {
                title: `Pandolist: ${user.name}`,
                offCanvasProject: user.project,
                lists: ownList,
                csrfToken: req.csrfToken()
            })
        } else {
            res.status(200).render("index/index-unauth", {
                title: "Pandolist"
            });
        }
    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        next(error);
    };
};

exports.searchResult = async (req, res, next) => {

    try {
        const keyword = req.query.q;
        const today = new Date();
        const date = today.getFullYear() + "-" + ('0' + (today.getMonth() + 1)).slice(-2) + "-" + ('0' + today.getDate()).slice(-2);
        const user = await User.findById(req.user._id)
            .populate("project");
        const searchProjects = await Project.find({
            auth: req.user._id
        }).populate({
            path: "list",
            match: {
                content: {
                    $regex: `${keyword}`,
                    $options: "i"
                }
            }
        });
        const searchresult = await searchProjects.filter(project => project.list.length != 0);

        return (searchresult.length != 0 ?
            res.status(200).render("searchResult", {
                title: `Search result: ${keyword}`,
                key: keyword,
                searchProjects: searchProjects,
                offCanvasProject: user.project,
                date: date
            }) :
            res.status(404).render("error", {
                title: `Search result: ${keyword}`,
                offCanvasProject: user.project,
                errorMessage: "Hmmm... Lists are not found. Please try again!"
            }))
    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};