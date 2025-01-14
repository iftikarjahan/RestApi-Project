const { validationResult } = require("express-validator");
const Post = require("../models/post");
const post = require("../models/post");
const fs = require("fs");
const path = require("path");
const User=require("../models/user"); 

exports.getPosts = (req, res, next) => {
  /*
    ->Setting the response status is very crucial now because we wont send any html
    page as the response. We would only send the status code and the data
    ->Based on the status code, data would be rendered 
    */

  // Impelement pagination
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res
        .status(200)
        .json({ message: "Fetched posts successfully.🎀🎀", posts: posts,totalItems:totalItems });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
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

  if (!req.file) {
    const error = new Error("No image has been provided🍃🍃");
    error.statusCode = 422; //validation error
    throw error;
  }

  const title = req.body.title;
  const imageUrl = req.file.path.replace("\\", "/"); //.replace is used for cross platform compatibility
  const content = req.body.content;

  // create a post in the db
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator:req.userId
  });
  let creator;

  post
    .save()
    .then((result) => {
      // Once I save the post, I also want to modify the corresponding user document
      return User.findById(req.userId);
    }).then(user=>{
      creator=user;
      user.posts.push(post);  //here mongoose will do all the heavy lifting of pulling out the postid and add that to the user.posts field
      return user.save();   //modify the user document also
    }).then(result=>{
      // send the response
      res.status(201).json({
        // 201 status code means that a resource was successfully created
        message:
          "HAAA HAAAA!!!!  Post created successfully from the node-express backend",
        post: post,
        creator:{_id:creator._id,name:creator.name}
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
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ message: "Post fetched", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500; //status code of 500 indicates a server side error
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
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
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image; //because this property is named as image using the formData() class
  if (req.file) {
    //if a new file has been picked
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error("No file picked");
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }
      // adding authorization checks
      if(post.creator.toString()!==req.userId){
        const error=new Error("Not authorised to update");
        error.statusCode=403;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        // this means that a new image has been added
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post Updated🚩🚩🚩", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        next(err);
      }
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not Found👩‍🦰👩‍🦰👩‍🦰");
        error.statusCode = 404;
        throw error;
      }
      // adding authorization checks
      if(post.creator.toString()!==req.userId){
        const error=new Error("Not authorised to DELETEEE");
        error.statusCode=403;
        throw error;
      }


      // Check if the user is logged in
      clearImage(post.imageUrl);
      return Post.findByIdAndDelete(postId);
    })
    .then((result) => {
      // console.log(result);
      return User.findById(req.userId);
    })
    .then(user=>{
      user.posts.pull(postId);
      return user.save();
    })
    .then(result=>{
      res.status(200).json({ message: "Post deleted successfully" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
