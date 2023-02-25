const follow = require("../models/follow");
const Follow = require("../models/follow");
const User = require("../models/user");

const followService = require("../services/followService");

const mongoosePaginate = require("mongoose-pagination");

const testFollow = (req, res) => {
  document.querySelector();

  return res.status(200).send({
    message: "message sent from: controllers/follow.js",
  });
};

// saving a follow action
const save = (req, res) => {
  // get data by body req
  const params = req.body;

  // get user id identified
  const identity = req.user;

  // create object with follow model
  let userToFollow = new Follow({
    user: identity.id,
    followed: params.followed,
  });

  // save object in DB
  userToFollow.save((error, followStored) => {
    if (error || !followStored) {
      return res.status(500).send({
        status: "error",
        message: "Unable to follow user",
      });
    }

    return res.status(200).send({
      status: "success",
      identity: req.user,
      follow: followStored,
    });
  });
};

// unfollow a user action
const unfollow = (req, res) => {
  // get user id
  const userId = req.user.id;

  // get followed user id to unfollow
  const followedId = req.params.id;

  // find followed id and unfollow
  Follow.find({
    user: userId,
    followed: followedId,
  }).remove((error, followDeleted) => {
    if (error || !followDeleted) {
      return res.status(500).send({
        status: "error",
        message: "you have not unfollowed anyone",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "follow deleted",
    });
  });
};

// followed user list
const following = (req, res) => {
  // get identified user id
  let userId = req.user.id;

  // check if id is in the params
  if (req.params.id) userId = req.params.id;

  // check the right page
  let page = 1;

  if (req.params.page) page = req.params.page;

  // user per page to show
  const itemsPerPage = 5;

  // Find a follow, populate date and paginate with mongoose paginate
  Follow.find({ user: userId })
    .populate("user followed", "-password -role -__v -email")
    .paginate(page, itemsPerPage, async (error, follows, total) => {
      // Get an array of ids of the users that follow me and those that I follow
      let followUserIds = await followService.followUserIds(req.user.id);

      return res.status(200).send({
        status: "success",
        message: "List of users that I am following",
        follows,
        total,
        pages: Math.ceil(total / itemsPerPage),
        user_following: followUserIds.following,
        user_follow_me: followUserIds.followers,
      });
    });
};

// Action list of users who follow any other user (I am followed, my followers)
const followers = (req, res) => {
  // Get the id of the identified user
  let userId = req.user.id;

  // Check if I get the id by parameter in url
  if (req.params.id) userId = req.params.id;

  // Check if I get the page, if not page 1
  let page = 1;

  if (req.params.page) page = req.params.page;

  // user per page to show
  const itemsPerPage = 5;

  Follow.find({ followed: userId })
    .populate("user", "-password -role -__v -email")
    .paginate(page, itemsPerPage, async (error, follows, total) => {
      let followUserIds = await followService.followUserIds(req.user.id);

      return res.status(200).send({
        status: "success",
        message: "List of users who follow me",
        follows,
        total,
        pages: Math.ceil(total / itemsPerPage),
        user_following: followUserIds.following,
        user_follow_me: followUserIds.followers,
      });
    });
};

module.exports = {
  testFollow,
  save,
  unfollow,
  following,
  followers,
};
