const jwt=require("jsonwebtoken")

module.exports=(req,res,next)=>{
    const authHeader=req.get("authorization");
    if(!authHeader){
        const error=new Error("The token was not sent by frontend. Please get authenticated first🚩🚩");
        error.statusCode=500;
        throw error;
    }
    const token=authHeader.split(" ")[1];
    let decodedToken;
    try{
        decodedToken=jwt.verify(token,"secretKey");
    }catch(err){
        err.statusCode=500;
        throw err;
    }
    if(!decodedToken){
        const error=new Error("Not Authenticatd. Unable to verify the jwt token🥲🥲");
        error.statusCode=401;
        throw error;
    }
    // now we are saving the userId in the req so that the info could be used inside other cases
    req.userId=decodedToken.userId;
    next();
}