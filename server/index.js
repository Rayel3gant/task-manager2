const express=require("express")
const app=express()
require("dotenv").config()
const cors=require("cors");
const dbConnection = require("./config/dbConnection");
const taskRoutes=require("./routes/route")

const Port= process.env.BACKEND_PORT || 3003;

app.use(express.json());
app.use(cors({
    origin:"*",     
    credentials:true, 
}))

dbConnection()
app.use("/v1",taskRoutes)

//default route
app.get("/" ,(req,res)=>{
    return res.json({
        success:true,
        message:"server activation successful"
    })
})

app.listen(Port, () =>{
    console.log("server started successfully on port ", Port);
})


