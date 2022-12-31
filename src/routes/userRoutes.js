const express     = require("express");
const passport    = require("passport");
const asyncAction = require("../utilities/catchAsync");
const router      = express.Router();
const userRoutes = require("../control/userControl")
import {auth, fireDB, initFirebase} from "../../db/initFirebase";
import 'firebase/database';
import 'firebase/auth';




router.route('/login')
      .get(userRoutes.renderLogin)
      .post(passport.authenticate('local',
              {
                  failureFlash:    true,
                  failureRedirect: '/login'
              }), userRoutes.login)


router.get('/logout', userRoutes.logout)


router.route('/register')
      .get(userRoutes.renderRegister)
      .post(asyncAction(userRoutes.register));


module.exports = router;



