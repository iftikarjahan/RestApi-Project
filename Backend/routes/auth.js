const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const User=require("../models/user");
const authController=require("../controllers/auth");

router.put("/signup", [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail()
    .custom((value,{req})=>{
        // return true if the validation passes
        /*
        ->if it involves an asynchronous task, it should return a promise that resolves if
        the validation passes or rejects if the validation fails
        */ 
       //if the validation fails, you can throw an error or return false
       return User.findOne({email:value}).then(userDoc=>{
        if(userDoc){
            Promise.reject("Email address already exists");
        }
       })
    }),
  body("password").trim().isLength({min:5}),
  body("name").trim().not().isEmpty()
],authController.signup);

module.exports = router;
