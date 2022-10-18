const path = require('path')

const { format } = require('date-fns')
const { v4: uuid } = require('uuid')

const fs = require('fs')
const fsPromises = require('fs').promises


const logEvents = async (message, logFileName) => {

    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
    const logItem = `uuid: ${uuid()}\t DateTime: ${dateTime}\t ${message} \n`

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))             
        }

        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)   

    } catch (err) {
        console.log(err)
    }

}


const logger = (req, res, next) => {

    logEvents(`method: ${req.method}\t req_origin: ${req.headers.origin}\t req_url: ${req.url}`, 'reqLog.log')     // logeEvents() function ma message & logFileName as parameter ko rup ma pass gareko cha

    console.log(`${req.method} ${req.path}`)

    next()                      
}


module.exports = { logEvents, logger }