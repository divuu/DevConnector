const express = require("express");
const router = express.Router();

// @route       get api/posts/test
// @description tests post route
// @acess       public
router.get("/test", (req, res) => res.json({ msg: "posts works normally" }));

module.exports = router;
