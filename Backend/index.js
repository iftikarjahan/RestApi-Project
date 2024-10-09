const express=require("express");
const app=express();
const feedRoutes=require("./routes/feed");
const bodyParser=require("body-parser");

/*
->We need to give the request also in the form of json
*/
app.use(bodyParser.json());

/*
->To resolve the CORS error,we need to set a header to every response that comes from the
client and then this hearder would be used to check if we are allowed to share resources
cross origin
->The browser checks for the response from the servers for the appropriate CORS headers.
*/ 
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Headers","Content-Type,Authorization");
    next();
})

app.use("/feed",feedRoutes);

app.listen(8080);
