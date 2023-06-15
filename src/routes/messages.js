const
    express = require('express'),
    router = express.Router(),
    MessageController = require('../controllers/messageController');

router.post('/create', MessageController.createMessage);
router.get('/:id', MessageController.getMessageById);
router.put('/:id', MessageController.updateMessageById);
router.delete('/:id', MessageController.deleteMessageById);

module.exports = router;
