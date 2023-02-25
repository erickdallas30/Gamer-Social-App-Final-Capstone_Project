const express = require("express");
const router = express.Router();
const multer = require("multer");
const UserContoller = require("../controllers/user");
const check = require("../middlewares/auth");

// setup to upload user avatar with multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/avatars/")
    },
    filename: (req, file, cb) => {
        cb(null, "avatar-"+Date.now()+"-"+file.originalname);
    }
});

const uploads = multer({storage});

// defining endpoints , routes
router.get("/test-user", check.auth, UserContoller.testUser);
router.post("/register", UserContoller.register);
router.post("/login", UserContoller.login);
router.get("/profile/:id", check.auth, UserContoller.profile);
router.get("/list/:page?", check.auth, UserContoller.list);
router.put("/update", check.auth, UserContoller.update);
router.post("/upload", [check.auth, uploads.single("file0")], UserContoller.upload);
router.get("/avatar/:file", UserContoller.avatar); // cambio
router.get("/counters/:id", check.auth, UserContoller.counters);

// exporting routes to the router
module.exports = router;