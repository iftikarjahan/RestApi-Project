const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"I am new"  
    },
    posts:[{
        // This creates a one-to-many realtionship between the user and the post collection
        // Since its an array, it indicates a one-to-many relationship

        type:Schema.Types.ObjectId,
        ref:"Post"
    }]
})

module.exports=mongoose.model("User",userSchema);