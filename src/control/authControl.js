const express = require("express");
const router  = express.Router();

/*
 * https://expressjs.com/en/guide/writing-middleware.html
 * https://www.toptal.com/firebase/role-based-firebase-authentication
 */


/*
 *
 * @param {req}
 * @param {res}
 * @param {next}
 * @option | {data-type} | parameter-name | description
 * @return-option | {data-type} | description
 *
 */
router.userPostLogout = (req, res, next) => {
    console.log("userPostLogout() called, logout redirect loading...");
    console.log("Current Path: /logout");
    req.session.destroy((err) => {
        res.redirect('/logout').status(200).json({message: "User logged out"})
    })
}


/*
 *
 * @param {req}
 * @param {res}
 * @param {next}
 * @option | {data-type} | parameter-name | description
 * @return-option | {data-type} | description
 *
 */
router.userGetLogin = (req, res, next) => {
    res.render('/login');
    console.log("userGetLogin() called, login redirect loading...");
    console.log("Current Path: /login");
}


/*
 *
 * @param {req}
 * @param {res}
 * @param {next}
 * @option | {data-type} | parameter-name | description
 * @return-option | {data-type} | description
 *
 */
router.userPostLogin = (req, res, next) => {
    const authToken = req.body.authToken;
    console.log("userPostLogin() called, checking authentication...");
}



/*
 *
 * @param {req}
 * @param {res}
 * @param {next}
 * @option | {data-type} | parameter-name | description
 * @return-option | {data-type} | description
 *
 */
router.userGetRegister = (req, res, next) => {
    res.render('/register', {status: "success"});
    console.log("userRegister() called, registry page loading...");
    console.log("Current Path: /register");
};


/*
 *
 * @param {req}
 * @param {res}
 * @param {next}
 * @option | {data-type} | parameter-name | description
 * @return-option | {data-type} | description
 *
 */
router.userPostRegister = (req, res, next) => {
    // TODO: User Model incomplete
    const userAgent = new User()
    console.log("userPostRegister() called, checking if conditions are met...");
    userAgent.register()
             .then((result) => {
                 return res.status(200)
                           .json({
                               status: "success",
                               mess:   " "
                           })
             })
             .catch((err) => {
                 return res.status(500)
                           .json({
                               status: "error",
                               mess:   ""
                           })
             });
};



module.exports = {router};
