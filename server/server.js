require('dotenv').config();
// import useful packages
const mongoose = require('mongoose');
const app = require('./express.js');
const PORT = process.env.PORT || 5000;
// Connect to the MongoDB Database
const URI = process.env.MONGO_URI;
// asynchronous function to connect to MongoDB
async function connect(){
    try{
        await mongoose.connect(URI);
        console.log("Connected to the Database");
    }catch(error){
        console.log(error);
    }
};

connect();



// Set up the Local Server
app.listen(PORT, ()=>{
    console.log(`Server is Listening on Port ${PORT}`);
})