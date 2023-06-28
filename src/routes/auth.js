const
    express = require('express'),
    router = express.Router(),
    AuthController = require('../controllers/authController');

router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/logged-in', AuthController.loggedIn);

module.exports = router;
