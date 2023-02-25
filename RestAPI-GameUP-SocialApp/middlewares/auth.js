const jwt = require("jwt-simple");
const moment = require("moment");

// importing secret password
const libjwt = require("../services/jwt");
const secret = libjwt.secret;

// MIDDLEWARE of authentcation
exports.auth = (req, res, next) => {
    
    // checking if I can get he authorization header
    if(!req.headers.authorization){
        return res.status(403).send({
            status: "error",
            message: "authentication header missing in the request"
        });
    }

    // clear token
    let token = req.headers.authorization.replace(/['"]+/g, '');

    // decoding token
    try{
        let payload = jwt.decode(token, secret);

        // test out token expiration
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                status: "error",
                message: "Token expired",
            });
        }

        // adding user data to request
        req.user = payload;

    }catch(error){
        return res.status(404).send({
            status: "error",
            message: "Invalid Token",
            error
        });
    }

    
    next();
}

