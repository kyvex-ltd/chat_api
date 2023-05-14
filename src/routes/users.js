const
    express = require('express'),
    router = express.Router(),
    UserController = require('../controllers/userController');

router.post('/register', UserController.createUser);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUserById);
router.delete('/:id', UserController.deleteUserById);

module.exports = router;
