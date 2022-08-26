const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect('mongodb+srv://admin-lulu:' + process.env.MONGODBPASSWORD + '@cluster0.duray.mongodb.net/todolistDB?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }).catch(err => console.log(err));;

module.exports = mongoose;