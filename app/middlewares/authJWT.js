const jwt = require("jsonwebtoken");
User = require("../models/user.model");

const verifyToken = (req, res, next) => {
    if(req.headers && req.headsers.authorization && req.headers.authorization.split(' ')[0] === 'JWT'){
        jwt.verify(req.headsers.authorization.split(' ')[1], process.env.API_SECRET,function(err, decode){
            if(err) req.user = undefined;
            User.findOne({
                _id: decode.id
            })
            .exec((err, user) =>{
                if(err){
                    res.status(500).send({
                        message: err
                    });
                }
                else {
                    req.user = user;
                    next();
                }
            })
        });
    }
    else{
        req.user = undefined;
        next();
    }
};
module.exports = verifyToken;