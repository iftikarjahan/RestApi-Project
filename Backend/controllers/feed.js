const {validationResult}=require("express-validator");

exports.getPosts = (req, res, next) => {
  /*
    ->Setting the response status is very crucial now because we wont send any html
    page as the response. We would only send the status code and the data
    ->Based on the status code, data would be rendered 
    */
  res.status(200).json({
    posts: [
      {
        _id:"1",
        title: "Post 1",
        content: "YOOOOO!!! This is the first post",
        imageUrl:"https://plus.unsplash.com/premium_photo-1683134240084-ba074973f75e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2FyfGVufDB8fDB8fHww",
        creator:{
          name:"Iftikar Jahan"
        },
        createdAt:new Date()
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const errors=validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({
      message:"Vlaidation Faileddddd!!!!!!",
      errors:errors.array()
    })
  }


  const title = req.body.title;
  const content = req.body.content;
  // 201 status code means that a resource was successfully created
  res.status(201).json({
    message: "Post created successfully from the node-express backend",
    post: {
      _id: new Date().toISOString(),
      title: title,
      content: content,
      creator:{
        name:"Jahan Babu"
      },
      createdAt:new Date()
    },
  });
};
