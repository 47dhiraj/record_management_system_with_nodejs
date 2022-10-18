const express = require('express')
const router = express.Router()

const recordsController = require('../controllers/recordsController')

const verifyJWT = require('../middleware/verifyJWT')

const multer = require('multer');

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
      cb(null, "uploads");                        
    },
    
    filename: (req, file, cb) => {
      cb(null, file.originalname);                 
    },

  });
  
const upload = multer({ storage: storage });


router.use(verifyJWT)                             

router.route('/')
    .get(recordsController.getAllRecords)
    .post(upload.single('image'), recordsController.createNewRecord)      
    .patch(recordsController.updateRecord)
    .delete(recordsController.deleteRecord)


module.exports = router