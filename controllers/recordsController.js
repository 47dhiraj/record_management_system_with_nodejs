const fs = require("fs");   
const Record = require('../models/Record')
const User = require('../models/User')
                               
const asyncHandler = require('express-async-handler')



/**
 * @swagger
 * tags:
 *   name: Records
 *   description: API Endpoints for Records
 */




// @desc Get all records 
// @route GET /records
// @access Private
/** 
 * @swagger
 *   /records:
 *     get:
 *       summary: Get all Records
 *       tags: [Records]
 *       responses:
 *         "200":
 *           description: The list of records
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Record'
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 */
const getAllRecords = asyncHandler(async (req, res) => {

    const records = await Record.find().lean()

    if (!records?.length) {
        return res.status(400).json({ message: 'No records found' })
    }

    const recordsWithUser = await Promise.all(records.map(async (record) => {
        const user = await User.findById(record.user).lean().exec()            
        return { ...record, username: user.username }
    }))


    res.json(recordsWithUser)
})




// @desc Create new record also by sending image file
// @route POST /records
// @access Private
const createNewRecord = asyncHandler(async (req, res, next) => {

    const image = { data: fs.readFileSync("uploads/" + req.file.filename), contentType: req.file.mimetype }

    const { user, title, text } = req.body

    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const duplicate = await Record.findOne({ title }).lean().exec()                
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate record title' })
    }

    const record = await Record.create({ user, title, text, image })

    if (record) { 
        return res.status(201).json({ message: 'New record created' })
    } else {
        return res.status(400).json({ message: 'Invalid record data received' })
    }

})




// @desc Update a record
// @route PATCH /records
// @access Private
/** 
 * @swagger
 *   /records:
 *     patch:
 *       summary: Update a Record
 *       tags: [Records]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Record'
 *               required:
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "204":
 *           description: Record updated successfully
 *           contents:
 *             application/json
 */
const updateRecord = asyncHandler(async (req, res) => {

    const { id, user, title, text, completed } = req.body

    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const record = await Record.findById(id).exec()                    
    if (!record) {
        return res.status(400).json({ message: 'Record not found' })
    }

    const duplicate = await Record.findOne({ title }).lean().exec()
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate record title' })
    }

    record.user = user
    record.title = title
    record.text = text
    record.completed = completed
    
    const updatedRecord = await record.save()

    res.json(`'${updatedRecord.title}' updated`)
})




// @desc Delete a record
// @route DELETE /records
// @access Private
/** 
 * @swagger
 *   /records:
 *     delete:
 *       summary: Delete a Record
 *       tags: [Records]
 *       requestBody:
 *         required: false
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Record'
 *               required:
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "204":
 *           description: Record deleted successfully
 *           contents:
 *             application/json
 */
const deleteRecord = asyncHandler(async (req, res) => {

    const { id } = req.body
    if (!id) {
        return res.status(400).json({ message: 'Record ID required' })
    }

    const record = await Record.findById(id).exec()
    if (!record) {
        return res.status(400).json({ message: 'Record not found' })
    }

    const result = await record.deleteOne()

    const reply = `Record '${result.title}' with ID ${result._id} deleted`
    res.json(reply)
})




module.exports = {
    getAllRecords,
    createNewRecord,
    updateRecord,
    deleteRecord
}
