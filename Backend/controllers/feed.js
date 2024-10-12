const { validationResult } = require("express-validator");
const Post = require("../models/post");

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
