const Project = require("../../models/project");

exports.search = (req, res, next) => {
    try {
        const keyword = req.body.search;
        res.redirect(`/search?q=${keyword}`);
    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};

exports.mylist = async (req, res, next) => {
    try {
        const allproject = await Project.find({
            auth: req.user._id
        }).populate({
            path: "list",
            match: {
                check: false
            },
            options: {
                populate: {
                    path: "project",
                    select: "num"
                }
            }
        });
        const allUndoneLists = await allproject.map(project => [...project.list]).flat();
        res.status(200).json({
            allUndoneLists: allUndoneLists
        });
    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        next(error);
    }
}