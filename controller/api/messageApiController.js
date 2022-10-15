const Message = require("../../models/message");
const User = require("../../models/user");

exports.createMessage = async (req, res, next) => {
  try {
    const projectId = req.body.projectId;
    const newMessageContent = req.body.newMessage;
    const userId = req.user._id;
    const user = await User.findById(userId);
    const newMessage = await new Message({
      content: newMessageContent,
      user: req.user._id,
      project: projectId
    }).save();

    res.status(200).json({
      newMessage: newMessage,
      user: user
    });

  } catch (err) {
    const error = new Error(err);
    error.statusCode = 500;
    return next(error);
  }
};