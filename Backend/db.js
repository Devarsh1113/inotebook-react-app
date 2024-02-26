const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/"

 const connectToMongo = async () =>
{
    try{
    const response =  await mongoose.connect(mongoURI);
    if(response){
        console.log("Successfull!!")
    }
    }
    catch{
        console.log("Error!")
    }

}

module.exports = connectToMongo;