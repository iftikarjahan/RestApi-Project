const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  /*
    ->Setting the response status is very crucial now because we wont send any html
    page as the response. We would only send the status code and the data
    ->Based on the status code, data would be rendered 
    */
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "Post 1",
        content: "YOOOOO!!! This is the first post",
        imageUrl:
          "https://plus.unsplash.com/premium_photo-1683134240084-ba074973f75e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2FyfGVufDB8fDB8fHww",
        creator: {
          name: "Iftikar Jahan",
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error=new Error("Vlaidation Faileddddd!!!!!! This is not good🥲🥲🥲");
    error.statusCode=422;
    throw error; //this line takes you to the error handling middleware
  }

  const title = req.body.title;
  const content = req.body.content;

  // create a post in the db
  const post = new Post({
    title: title,
    content: content,
    imageUrl:"https://plus.unsplash.com/premium_photo-1672116453187-3aa64afe04ad?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
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
        message: "HAAA HAAAA!!!!  Post created successfully from the node-express backend",
        post: result
      });
    })
    .catch((err) => {
      if(!err.statusCode){
        err.statusCode=500;  //status code of 500 indicates a server side error
      }      
      next(err);
    });
};
