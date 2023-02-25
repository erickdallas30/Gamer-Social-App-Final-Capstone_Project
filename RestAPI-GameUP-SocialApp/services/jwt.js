// import dependencies
const jwt = require("jwt-simple");
const moment = require("moment");

// secret password
const secret = "123456789";

// function to generates tokens
const createToken = (user) => {
  const payload = {
    id: user._id,
    name: user.name,
    surname: user.surname,
    nick: user.nick,
    email: user.email,
    role: user.role,
    image: user.image,
    iat: moment().unix(),
    exp: moment().add(30, "days").unix(),
  };

  // getting JSON web token (jwt) decoded
  return jwt.encode(payload, secret);
};

module.exports = {
  secret,
  createToken,
};
