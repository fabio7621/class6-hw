const express = require('express');
const router = express.Router();
const upload = require('../service/image');
const {isAuth,generateSendJWT} = require('../service/auth');
const  { uploadCon } = require("../controllers/uploadCon");


router.post('/file',isAuth,upload,uploadCon);
module.exports = router;