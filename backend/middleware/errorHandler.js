const { logEvents } = require('./logger')


const errorHandler = (err, req, res, next) => {

    logEvents(`${err.name}: ${err.message}\t method: ${req.method}\t req_origin: ${req.headers.origin}\t req_url: ${req.url}`, 'errLog.log')   
    // console.log(err.stack)

    const status = res.statusCode ? res.statusCode : 500        
    res.status(status)                                   

    res.json({ message: err.message, isError: true })                   

}


module.exports = errorHandler 
