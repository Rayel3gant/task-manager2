
const mongoose=require("mongoose");
require("dotenv").config();

const dbConnection =() =>{
    mongoose.connect( process.env.DATABASE_URL, {
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then ( ( )=> console.log( "database connection successful"))
    .catch( (error) =>{
        console.log("database connection failed");
        console.error(error);
        process.exit(1);
    } );  
}
module.exports=dbConnection;


