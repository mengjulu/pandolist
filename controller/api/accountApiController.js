const User = require("../../models/user");
const FormData = require("form-data");
const axios = require("axios");
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
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.uploadAvatar = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const deleteHash = await user.avatar.deleteHash;
        const imageFormData = new FormData();
        const uploadImage = req.file.buffer.toString("base64");
        imageFormData.append("image", uploadImage);
        const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
        const headers = {
            Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
            ...imageFormData.getHeaders()
        };

        // delete previous avatar if it exists
        if (deleteHash) {
            axios({
                method: "delete",
                url: `https://api.imgur.com/3/image/${deleteHash}`,
                headers: headers
            });
        };
        // upload new avatar to imgur
        await axios({
            method: "post",
            url: `https://api.imgur.com/3/image`,
            headers: headers,
            data: imageFormData
        }).then(response => {
            const link = response.data.data.link;
            user.avatar.avatarPhoto = link;
            user.save();
            res.status(200).json({
                avatarPhoto: link
            });
        });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};