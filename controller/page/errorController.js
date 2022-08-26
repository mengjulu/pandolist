const User = require("../../models/user");

exports.serverError = async (req, res) => {
    try{
    const user = await User.findById(req.user._id)
        .populate("project");
    res.status(500).render(
        "error", {
            title: "Oops! ;(",
            offCanvasProject: user.project,
            errorMessage: "Something goes wrong! Sorry for the inconvenience, we will fix it ASAP!"
        }
    )
    } catch(err) {
        console.log(err);
    }
};

exports.pageNotFoundError = async (req, res) => {
    try{
    const user = await User.findById(req.user._id)
        .populate("project");

    res.status(404).render(
        "error", {
            title: "Oops! ;(",
            offCanvasProject: user.project,
            errorMessage: "The page is not found or never exist. Please enter a valid address."
        }
    )
    } catch(err) {
        console.log(err);
    }
};