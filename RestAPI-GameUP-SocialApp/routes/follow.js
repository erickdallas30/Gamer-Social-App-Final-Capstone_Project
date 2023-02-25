const express = require("express");
const router = express.Router();
const FollowContoller = require("../controllers/follow");
const check = require("../middlewares/auth");


router.get("/test-follow", FollowContoller.testFollow);
router.post("/save", check.auth, FollowContoller.save);
router.delete("/unfollow/:id", check.auth, FollowContoller.unfollow);
router.get("/following/:id?/:page?", check.auth, FollowContoller.following);
router.get("/followers/:id?/:page?", check.auth, FollowContoller.followers);


module.exports = router;