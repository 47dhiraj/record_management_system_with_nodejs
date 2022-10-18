const bcrypt = require('bcrypt')                                         
const jwt = require('jsonwebtoken')                                     

const asyncHandler = require('express-async-handler')                  

const User = require('../models/User')



/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API Endpoints for JWT Authentication
 */


// @desc Login
// @route POST /auth
// @access Public
/** 
 * @swagger
 *   /auth:
 *     post:
 *       summary: User Authentication
 *       tags: [Auth]
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
 *           description: User Authenticated
 *           contents:
 *             application/json
 */
const login = asyncHandler(async (req, res) => {

    const { username, password } = req.body                           

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ username }).exec()           

    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password);   

    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    const accessToken = jwt.sign(
        {
            "UserInfo": {                              
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,                
        { expiresIn: '30s' }                            
    )

    const refreshToken = jwt.sign(
        { "username": foundUser.username },             
        process.env.REFRESH_TOKEN_SECRET,          
        { expiresIn: '1m' }                            
    )

    res.cookie('jwt', refreshToken, {                   
        httpOnly: true,                               
        sameSite: 'None',                               
        secure: true,                                   
        maxAge: 7 * 24 * 60 * 60 * 1000                 
    });


    res.json({ accessToken })
})





// @desc Refresh
// @route GET /auth/refresh
// @access Public - Since, access token has been already expired
/** 
 * @swagger
 *   /auth/refresh:
 *     get:
 *       summary: Refresh JWT access token
 *       tags: [Auth]
 *       responses:
 *         "200":
 *           description: Token Refreshed
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 */
const refresh = (req, res) => {

    const cookies = req.cookies        

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' }) 

    const refreshToken = cookies.jwt        

    jwt.verify(                   
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,

        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {                         
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },

                process.env.ACCESS_TOKEN_SECRET,

                { expiresIn: '30s' }
            )

            res.json({ accessToken })                       
        })
    )

}





// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists in frontend & logout user
/** 
 * @swagger
 *   /auth/logout:
 *     post:
 *       summary: Logout user
 *       tags: [Auth]
 *       responses:
 *         "200":
 *           description: User loggedout & cookie cleared
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         "204":
 *           $ref: '#/components/responses/204'
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 */
const logout = (req, res) => {

    const cookies = req.cookies                           

    if (!cookies?.jwt) return res.sendStatus(204)           
    
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, maxAge: 0 });

    res.json({ message: 'Logged out' })
}




module.exports = {
    login,
    refresh,
    logout
}