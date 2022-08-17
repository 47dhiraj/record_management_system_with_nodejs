const bcrypt = require('bcrypt')
const User = require('../models/User')
const Record = require('../models/Record')

const asyncHandler = require('express-async-handler')                                



/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API Endpoints for Users
 */




// @desc Get all users
// @route GET /users
// @access Private
/** 
 * @swagger
 *   /users:
 *     get:
 *       summary: Get all Users
 *       tags: [Users]
 *       responses:
 *         "200":
 *           description: The list of users
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 */
const getAllUsers = asyncHandler(async (req, res) => {

    const users = await User.find().lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)                                                  
})




// @desc Create new user
// @route POST /users
// @access Private
/** 
 * @swagger
 *   /users:
 *     post:
 *       summary: Create a new User
 *       tags: [Users]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "201":
 *           description: New User created successfully
 *           contents:
 *             application/json
 */
const createNewUser = asyncHandler(async (req, res) => {

    const { username, password, roles } = req.body                          

    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const duplicate = await User.findOne({ username }).lean().exec()   
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })    
    }

    const hashedPwd = await bcrypt.hash(password, 10)                      

    const userObject = { username, "password": hashedPwd, roles } 
    const user = await User.create(userObject)

    if (user) { 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})





// @desc Update a user
// @route PATCH /users
// @access Private
/** 
 * @swagger
 *   /users:
 *     patch:
 *       summary: Update a User
 *       tags: [Users]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *               required:
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "204":
 *           description: User updated successfully
 *           contents:
 *             application/json
 */
const updateUser = asyncHandler(async (req, res) => {

    const { id, username, roles, active, password } = req.body              

    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') 
    {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    const user = await User.findById(id).exec()    
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const duplicate = await User.findOne({ username }).lean().exec()     
    if (duplicate && duplicate?._id.toString() !== id) {                   
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        user.password = await bcrypt.hash(password, 10)          
    }

    const updatedUser = await user.save()                              

    res.json({ message: `${updatedUser.username} updated` })
})





// @desc Delete a user
// @route DELETE /users
// @access Private
/** 
 * @swagger
 *   /users:
 *     delete:
 *       summary: Delete a User
 *       tags: [Users]
 *       requestBody:
 *         required: false
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *               required:
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "204":
 *           description: User deleted successfully
 *           contents:
 *             application/json
 */
const deleteUser = asyncHandler(async (req, res) => {

    const { id } = req.body                                                 

    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    const record = await Record.findOne({ user: id }).lean().exec()
    if (record) {
        return res.status(400).json({ message: 'User has assigned records' })
    }

    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()                             

    const reply = `Username ${result.username} with ID ${result._id} deleted`
    res.json(reply)
})



module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}
