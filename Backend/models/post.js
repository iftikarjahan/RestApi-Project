const mongoose=require("mongoose");
const Schema=mongoose.Schema;   //this is a constructor function

const postSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    creator:{
        type:Object,
        required:true
    }
},{timestamps:true})

// Now we need to export the model based out of that schema
MediaSourceHandle.exports=mongoose.model("Post",postSchema);

