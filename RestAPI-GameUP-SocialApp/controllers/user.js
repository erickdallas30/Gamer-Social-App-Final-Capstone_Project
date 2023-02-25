// import depedencies and modules
const bcrypt = require("bcrypt");
const mongoosePagination = require("mongoose-pagination");
const fs = require("fs");
const path = require("path");

// import modules
const User = require("../models/user");
const Follow = require("../models/follow");
const Publication = require("../models/publication");

// import services
const jwt = require("../services/jwt");
const followService = require("../services/followService");
const validate = require("../helpers/validate");

// action test
const testUser = (req, res) => {
  return res.status(200).send({
    message: "Message sent from: controllers/user.js",
    usuario: req.user,
  });
};

// user registration
const register = (req, res) => {
  // getting data from the request
  let params = req.body;

  // test out the validation is correct
  if (!params.name || !params.email || !params.password || !params.nick) {
    return res.status(400).json({
      status: "error",
      message: "missing data to send",
    });
  }

  // advance validation
  try {
    validate(params);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
    });
  }

  // controlling duplicated users
  User.find({
    $or: [
      { email: params.email.toLowerCase() },
      { nick: params.nick.toLowerCase() },
    ],
  }).exec(async (error, users) => {
    if (error)
      return res
        .status(500)
        .json({ status: "error", message: "Error in user query" });

    if (users && users.length >= 1) {
      return res.status(200).send({
        status: "success",
        message: "User already exists",
      });
    }

    // encrypt password
    let pwd = await bcrypt.hash(params.password, 10);
    params.password = pwd;

    // create user object
    let user_to_save = new User(params);

    // Save user in database
    user_to_save.save((error, userStored) => {
      if (error || !userStored)
        return res
          .status(500)
          .send({ status: "error", message: "Error saving user" });

      // added
      userStored.toObject();
      delete userStored.password;
      delete userStored.role;

      // getting results back
      return res.status(200).json({
        status: "success",
        message: "User successfully registered",
        user: userStored,
      });
    });
  });
};

const login = (req, res) => {
  // getting body params
  let params = req.body;

  if (!params.email || !params.password) {
    return res.status(400).send({
      status: "error",
      message: "Missing data to send",
    });
  }

  // search if user exists in DB
  User.findOne({ email: params.email })
    //.select({ "password": 0 })
    .exec((error, user) => {
      if (error || !user)
        return res
          .status(404)
          .send({ status: "error", message: "The user does not exist" });

      // test out user password
      const pwd = bcrypt.compareSync(params.password, user.password);

      if (!pwd) {
        return res.status(400).send({
          status: "error",
          message: "You have not correctly identified",
        });
      }

      const token = jwt.createToken(user);

      return res.status(200).send({
        status: "success",
        message: "You have correctly identified",
        user: {
          id: user._id,
          name: user.name,
          nick: user.nick,
        },
        token,
      });
    });
};

const profile = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .select({ password: 0, role: 0 })
    .exec(async (error, userProfile) => {
      if (error || !userProfile) {
        return res.status(404).send({
          status: "error",
          message: "The user does not exist or there is an error",
        });
      }

      const followInfo = await followService.followThisUser(req.user.id, id);

      return res.status(200).send({
        status: "success",
        user: userProfile,
        following: followInfo.following,
        follower: followInfo.follower,
      });
    });
};

const list = (req, res) => {
  // controlling pagination
  let page = 1;
  if (req.params.page) {
    page = req.params.page;
  }
  page = parseInt(page);

  // query with mongoose paginate
  let itemsPerPage = 5;

  User.find()
    .select("-password -email -role -__v")
    .sort("_id")
    .paginate(page, itemsPerPage, async (error, users, total) => {
      if (error || !users) {
        return res.status(404).send({
          status: "error",
          message: "No users available",
          error,
        });
      }

      // Get an array of ids of the users that follow me and those that I follow
      let followUserIds = await followService.followUserIds(req.user.id);

      return res.status(200).send({
        status: "success",
        users,
        page,
        itemsPerPage,
        total,
        pages: Math.ceil(total / itemsPerPage),
        user_following: followUserIds.following,
        user_follow_me: followUserIds.followers,
      });
    });
};

const update = (req, res) => {
  // getting data user to update
  let userIdentity = req.user;
  let userToUpdate = req.body;

  // Remove excess fields
  delete userToUpdate.iat;
  delete userToUpdate.exp;
  delete userToUpdate.role;
  delete userToUpdate.image;

  // Check if the user already exists
  User.find({
    $or: [
      { email: userToUpdate.email.toLowerCase() },
      { nick: userToUpdate.nick.toLowerCase() },
    ],
  }).exec(async (error, users) => {
    if (error)
      return res
        .status(500)
        .json({ status: "error", message: "Error in user query" });

    let userIsset = false;
    users.forEach((user) => {
      if (user && user._id != userIdentity.id) userIsset = true;
    });

    if (userIsset) {
      return res.status(200).send({
        status: "success",
        message: "User already exists",
      });
    }

    // encrypt password
    if (userToUpdate.password) {
      let pwd = await bcrypt.hash(userToUpdate.password, 10);
      userToUpdate.password = pwd;
    } else {
      delete userToUpdate.password;
    }

    // find and update with the new password encrypted
    try {
      let userUpdated = await User.findByIdAndUpdate(
        { _id: userIdentity.id },
        userToUpdate,
        { new: true }
      );

      if (!userUpdated) {
        return res
          .status(400)
          .json({ status: "error", message: "Failed to update" });
      }

      return res.status(200).send({
        status: "success",
        message: "User update method",
        user: userUpdated,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Failed to update",
      });
    }
  });
};

const upload = (req, res) => {
  // getting imag data and check if it already exists
  if (!req.file) {
    return res.status(404).send({
      status: "error",
      message: "Request does not include the image",
    });
  }

  // get name of the file
  let image = req.file.originalname;

  // get file extension
  const imageSplit = image.split(".");
  const extension = imageSplit[1];

  // check extension
  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gif"
  ) {
    // delete uploaded file
    const filePath = req.file.path;
    const fileDeleted = fs.unlinkSync(filePath);

    return res.status(400).send({
      status: "error",
      message: "file type invalid",
    });
  }

  // if the file is correct , save it to the DB
  User.findOneAndUpdate(
    { _id: req.user.id },
    { image: req.file.filename },
    { new: true },
    (error, userUpdated) => {
      if (error || !userUpdated) {
        return res.status(500).send({
          status: "error",
          message: "Error en la subida del avatar",
        });
      }

      return res.status(200).send({
        status: "success",
        user: userUpdated,
        file: req.file,
      });
    }
  );
};

const avatar = (req, res) => {
  // get URL param
  const file = req.params.file;

  // load image path
  const filePath = "./uploads/avatars/" + file;

  // check if it already exist
  fs.stat(filePath, (error, exists) => {
    if (!exists) {
      return res.status(404).send({
        status: "error",
        message: "The image does not exist",
      });
    }

    return res.sendFile(path.resolve(filePath));
  });
};

// added
const counters = async (req, res) => {
  let userId = req.user.id;

  if (req.params.id) {
    userId = req.params.id;
  }

  try {
    const following = await Follow.count({ user: userId });

    const followed = await Follow.count({ followed: userId });

    const publications = await Publication.count({ user: userId });

    return res.status(200).send({
      userId,
      following: following,
      followed: followed,
      publications: publications,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error in the counters",
      error,
    });
  }
};

// exporting actions
module.exports = {
  testUser,
  register,
  login,
  profile,
  list,
  update,
  upload,
  avatar,
  counters,
};
