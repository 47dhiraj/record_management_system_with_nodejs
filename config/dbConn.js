const mongoose = require('mongoose')


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI,{
            useUnifiedTopology: true,                       
            useNewUrlParser: true,                         
            autoIndex: true,
        });

    } catch (err) {
        console.log(err)               
    }
}


module.exports = connectDB