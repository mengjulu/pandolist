const User = require("../../models/user");
const imgurClient = require("../../config/imgur");
require("dotenv").config();

exports.editUserName = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const newUserName = req.body.newUserName;
        user.name = newUserName;
        await user.save();

        res.status(200).json({
            editNameStatus: user.name = newUserName ? true : false,
            newUserName: newUserName
        });
    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};

exports.uploadAvatar = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const deleteHash = user.avatar.deleteHash;
        const uploadImage = req.file.buffer.toString("base64");

        // delete previous avatar if it exists
        if (deleteHash) imgurClient.deleteImage(`${deleteHash}`);
        // upload new avatar to imgur
        const response = await imgurClient.upload({
            image: uploadImage,
            type: "base64",
            album: process.env.IMGUR_ALBUM_ID
        });
        user.avatar.avatarPhoto = response.data.link;
        user.avatar.deleteHash = response.data.deleteHash;
        await user.save();

        res.status(200).json({
            avatarPhoto: user.avatar.avatarPhoto
        });

    } catch (err) {
        console.log(err)
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};