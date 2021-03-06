const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) =>{
     const authHeader = req.headers.token     
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err,user) =>{
            if(err) res.status(401).json("Token is not valid!");
            req.user = user;
            next();
        });
    }else{
        return res.status(401).json("You are not authenticated")
    }
};

const authorizationToken = (req,res,next) =>{
    verifyToken(req,res, () =>{
        if (req.user.id === req.params.id || req.user.isAdmin) {
             next()
        }else{
            res.status(403).json("You are not authorized for this action!")
        }
    })
};

const adminToken = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin === true) {
      next();
    } else {
      res.status(403).json("You are not authorized for this action!");
    }
  });
};

module.exports = { verifyToken, authorizationToken, adminToken };