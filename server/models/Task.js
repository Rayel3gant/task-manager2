const mongoose=require("mongoose")

const schema=new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
    },
    dueDate: {
      type: Date,
      required:true
    }, 
    createdAt:{
        type:Date,
        default:Date.now()
    }
},{timestamps:true})

module.exports=mongoose.model("Task",schema)