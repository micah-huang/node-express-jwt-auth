const { Router } = require('express')
const authController = require('../controllers/authController');

const router = Router();

// setup the routes:
// get request handle the views display
// post requests handle the actual authen processes

// we'll import the functions from controller to handle each request
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);


module.exports = router;