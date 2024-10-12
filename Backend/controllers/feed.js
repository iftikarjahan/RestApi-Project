const { validationResult } = require("express-validator");
const Post = require("../models/post");
const post = require("../models/post");
const fs=require("fs");
const path=require("path");

exports.getPosts = (req, res, next) => {
  /*
    ->Setting the response status is very crucial now because we wont send any html
    page as the response. We would only send the status code and the data
    ->Based on the status code, data would be rendered 
    */
  Post.find()
    .then(posts=>{
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({message:"Fetched posts successfully. Yayyy",posts:posts})
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500; //status code of 500 indicates a server side error
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(
      "Vlaidation Faileddddd!!!!!! This is not good🥲🥲🥲"
    );
    error.statusCode = 422;
    throw error; //this line takes you to the error handling middleware
  }

  if(!req.file){
    const error=new Error("No image has been provided🍃🍃");
    error.statusCode=422;    //validation error
    throw error;
  }

  const title = req.body.title;
  const imageUrl = req.file.path.replace("\\" ,"/");   //.replace is used for cross platform compatibility
  const content = req.body.content;

  // create a post in the db
  const post = new Post({
    title: title,
    content: content,
    imageUrl:imageUrl,
    creator: {
      name: "Jahan Babuu",
    },
  });

  post
    .save()
    .then((result) => {
      console.log(result);
      // send the response
      res.status(201).json({
        // 201 status code means that a resource was successfully created
        message:
          "HAAA HAAAA!!!!  Post created successfully from the node-express backend",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500; //status code of 500 indicates a server side error
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find the post🤔🤔🤔");
        error.statusCode = 404; //resource not found
        throw error; //this would take the error to the next catch block
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ message: "Post fetched", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500; //status code of 500 indicates a server side error
      }
      next(err);
    });
};

exports.updatePost=(req,res,next)=>{
  
  // input validation result
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(
      "Vlaidation Faileddddd!!!!!! This is not good🥲🥲🥲"
    );
    error.statusCode = 422;
    throw error; //this line takes you to the error handling middleware
  }

  // fetching the inputs given by user
  const postId=req.params.postId;
  const title=req.body.title;
  const content=req.body.content;
  let imageUrl=req.body.image;   //because this property is named as image using the formData() class
  if(req.file){  //if a new file has been picked
    imageUrl=req.file.path;
  }
  if(!imageUrl){
    const error=new Error("No file picked");
    error.statusCode=422;
    throw error;
  }

  Post.findById(postId).then(post=>{
    if(!post){
      const error=new Error("Post not found");
      error.statusCode=404;
      throw error;
    }
    if(imageUrl!==post.imageUrl){
      // this means that a new image has been added
      clearImage(post.imageUrl);
    }
    post.title=title;
    post.imageUrl=imageUrl;
    post.content=content;
    return post.save();
  }).then(result=>{
    res.status(200).json({message:"Post Updated🚩🚩🚩",post:result})
  }).catch(err=>{
    if(!err.statusCode){
      err.statusCode=500;
      next(err);
    }
  })

}

const clearImage=filePath=>{
  filePath=path.join(__dirname,"..",filePath);
  fs.unlink(filePath,err=>console.log(err));
}