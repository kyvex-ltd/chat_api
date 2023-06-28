const
    express = require('express'),
    router = express.Router(),
    ChannelController = require('../controllers/channelController');

router.post('/create', ChannelController.createCommunity);
router.get('/:id', ChannelController.getCommunityById);
router.put('/:id', ChannelController.updateCommunity);
router.delete('/:id', ChannelController.deleteCommunity);

module.exports = router;
