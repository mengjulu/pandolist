const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).catch(err => console.log(err));;

module.exports = mongoose;