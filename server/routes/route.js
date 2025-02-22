const express=require("express")
const { createTask, getAllTask, deleteTask, updateTask } = require("../controllers/taskController")
const router=express.Router()

router.post("/createTask",createTask)
router.post("/updateTask",updateTask)
router.get("/getAllTasks",getAllTask)
router.post("/deleteTask",deleteTask)


module.exports=router