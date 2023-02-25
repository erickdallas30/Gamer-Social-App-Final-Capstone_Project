const fs = require("fs");
const path = require("path");

const Publication = require("../models/publication");

const followService = require("../services/followService");

const testPublication = (req, res) => {
  return res.status(200).send({
    message: "Message sent from: controllers/publication.js",
  });
};

// saving publication
const save = (req, res) => {
  const params = req.body;

  if (!params.text)
    return res.status(400).send({
      status: "error",
      message:
        "you have to insert at least one character to post the publication.",
    });

  //Create and fill the model object
  let newPublication = new Publication(params);
  newPublication.user = req.user.id;

  // save object in DB
  newPublication.save((error, publicationStored) => {
    if (error || !publicationStored)
      return res.status(400).send({
        status: "error",
        message: "Publication is not saved.",
      });

    return res.status(200).send({
      status: "success",
      message: "Publication saved",
      publicationStored,
    });
  });
};

// geting one publication
const detail = (req, res) => {
  // get publication id
  const publicationId = req.params.id;

  // Find the publication id
  Publication.findById(publicationId, (error, publicationStored) => {
    if (error || !publicationStored) {
      return res.status(404).send({
        status: "error",
        message: "Publication does not exist",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "show publication",
      publication: publicationStored,
    });
  });
};

// deleting publications
const remove = (req, res) => {
  // get publication id to delete
  const publicationId = req.params.id;

  // find publication and then delete it
  Publication.find({ user: req.user.id, _id: publicationId }).remove(
    (error) => {
      if (error) {
        return res.status(500).send({
          status: "error",
          message: "publication not deleted",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "publication deleted",
        publication: publicationId,
      });
    }
  );
};

// showing publication of a user
const user = (req, res) => {
  // get user id
  const userId = req.params.id;

  // control publication pages to show
  let page = 1;

  if (req.params.page) page = req.params.page;

  const itemsPerPage = 5;

  // Find, populate, order and pager
  Publication.find({ user: userId })
    .sort("-created_at")
    .populate("user", "-password -__v -role -email")
    .paginate(page, itemsPerPage, (error, publications, total) => {
      if (error || !publications || publications.length <= 0) {
        return res.status(404).send({
          status: "error",
          message: "no publications to show",
        });
      }

      return res.status(200).send({
        status: "success",
        message: "publications from a user profile",
        page,
        total,
        pages: Math.ceil(total / itemsPerPage),
        publications,
      });
    });
};

// upload publications
const upload = (req, res) => {
  // get publication id
  const publicationId = req.params.id;

  // get image file and check if it exists
  if (!req.file) {
    return res.status(404).send({
      status: "error",
      message: "Request does not include the image",
    });
  }

  // get the file name
  let image = req.file.originalname;

  // get the extension file
  const imageSplit = image.split(".");
  const extension = imageSplit[1];

  // check extensions
  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gif"
  ) {
    // delete file uploaded if the extension is not valid
    const filePath = req.file.path;
    const fileDeleted = fs.unlinkSync(filePath);

    return res.status(400).send({
      status: "error",
      message: "invalid file extension",
    });
  }

  // if the image file has a valid extension , save it to the DB
  Publication.findOneAndUpdate(
    { user: req.user.id, _id: publicationId },
    { file: req.file.filename },
    { new: true },
    (error, publicationUpdated) => {
      if (error || !publicationUpdated) {
        return res.status(500).send({
          status: "error",
          message: "Avatar upload error",
        });
      }

      return res.status(200).send({
        status: "success",
        publication: publicationUpdated,
        file: req.file,
      });
    }
  );
};

//Return media files
const media = (req, res) => {
  //Get the parameter from the url
  const file = req.params.file;

  //Mount the real path of the image
  const filePath = "./uploads/publications/" + file;

  // check if the image exists
  fs.stat(filePath, (error, exists) => {
    if (!exists) {
      return res.status(404).send({
        status: "error",
        message: "The image does not exist",
      });
    }

    // send the file
    return res.sendFile(path.resolve(filePath));
  });
};

// list all the publication in the FEED
const feed = async (req, res) => {
  // get current page
  let page = 1;

  if (req.params.page) {
    page = req.params.page;
  }

  //Set number of elements per page
  let itemsPerPage = 5;

  //Get an array of user identifiers that I follow as an identified user
  try {
    const myFollows = await followService.followUserIds(req.user.id);

    //Find a publication, sort, populate, paginate
    const publications = Publication.find({ user: myFollows.following })
      .populate("user", "-password -role -__v -email")
      .sort("-created_at")
      .paginate(page, itemsPerPage, (error, publications, total) => {
        if (error || !publications) {
          return res.status(500).send({
            status: "error",
            message: "no publications to show",
          });
        }

        return res.status(200).send({
          status: "success",
          message: "Feed of publications",
          following: myFollows.following,
          total,
          page,
          pages: Math.ceil(total / itemsPerPage),
          publications,
        });
      });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error getting users followed",
    });
  }
};

module.exports = {
  testPublication,
  save,
  detail,
  remove,
  user,
  upload,
  media,
  feed,
};
