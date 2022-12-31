const express    = require("express");
const router     = express.Router();
const controller = require('../control/authControl');


router.get('/login',        controller.router.userGetLogin);
router.get('/login/:id',     controller.router.userPostLogin);
router.get('/logout',       controller.router.userPostLogout);
router.get('/register',     controller.router.userGetRegister);
router.get('/register/:id',  controller.router.userPostRegister);



module.exports = {router};
