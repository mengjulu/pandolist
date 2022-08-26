const express = require("express");
const router = express.Router();
const indexController = require("../controller/page/indexController");
const indexApiController = require("../controller/api/indexApiController");
const authApiController = require("../controller/api/authApiController");
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: false });

router.get("/", csrfProtection, indexController.indexPage);
router.get("/mylist", indexApiController.mylist);
    
//search list
router.route("/search")
.get(authApiController.auth, indexController.searchResult)
.post(indexApiController.search);

module.exports = router;