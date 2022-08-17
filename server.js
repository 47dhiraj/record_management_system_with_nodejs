require('dotenv').config()                                        

const express = require('express')                                  
const app = express()                                             

const path = require('path')                                        

const cors = require('cors')                                       
const corsOptions = require('./config/corsOptions');               

const { logger, logEvents } = require('./middleware/logger')

const errorHandler = require('./middleware/errorHandler')

const cookieParser = require('cookie-parser');                      

var bodyParser = require('body-parser');                            

const mongoose = require('mongoose');                          

const connectDB = require('./config/dbConn');                      

const swaggerJsdoc = require("swagger-jsdoc")                       
const swaggerUi = require("swagger-ui-express");                  
const options = require('./swagger/swagger');                      


const PORT = process.env.PORT || 3500 


connectDB();

app.use(logger)                                                   

app.use(cors(corsOptions));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(cookieParser());            


app.use('/', express.static(path.join(__dirname, 'public')))      
app.use('/', require('./routes/root'))                 
app.use('/users', require('./routes/userRoutes'))                  
app.use('/records', require('./routes/recordRoutes'))


const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
)


app.all('*', (req, res) => {
    res.status(404)

    if (req.accepts('html')) {                                      
        res.sendFile(path.join(__dirname, 'views', '404.html'))   
    } else if (req.accepts('json')) {                              
        res.json({ message: '404 Not Found' })                  
    } else {
        res.type('txt').send('404 Not Found')                     
    }
})


app.use(errorHandler);


mongoose.connection.once('open', () => {                 
    console.log('Express APP connected to MongoDB Database')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {                           
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t ${err.syscall}\t ${err.hostname}`, 'mongoErrLog.log')
})
