const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)   



const recordSchema = new mongoose.Schema(
    {

        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'                         
        },

        title: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 120,
        },

        text: {
            type: String,
            required: true
        },

        completed: {
            type: Boolean,
            default: false                      
        },

        image: {                              
            data: Buffer,                      
            contentType: String
        },

    },
    {
        timestamps: true                       
    }

)


recordSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',                                    
    id: 'ticketNums',                                       
    start_seq: 500                                 
})



module.exports = mongoose.model('Record', recordSchema)
