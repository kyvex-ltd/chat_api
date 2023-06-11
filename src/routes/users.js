const
    express = require('express'),
    router = express.Router(),
    UserController = require('../controllers/userController');

router.post('/register', UserController.createUser);
router.get('/:tag', UserController.getUserByTag);
router.put('/:tag', UserController.updateUserById);
router.delete('/:tag', UserController.deleteUserById);

module.exports = router;
