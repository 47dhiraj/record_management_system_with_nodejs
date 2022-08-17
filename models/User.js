const mongoose = require('mongoose')



const userSchema = new mongoose.Schema({      

    username: {                              
        type: String,
        required: true,
        minLength: 3,
        maxLength: 80,
        unique: true
    },

    password: {                        
        type: String,
        required: true,
        minLength: 3,
        select: false                          
    },

    roles: [{                             
        type: String,
        default: "Employee"
    }],

    active: {                               
        type: Boolean,
        default: true
    }

})


module.exports = mongoose.model('User', userSchema)
