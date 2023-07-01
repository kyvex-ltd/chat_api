const
    express = require('express'),
    router = express.Router(),
    CommunityController = require('../controllers/communityController');

/**
 *
 */

router.post('/create', CommunityController.createCommunity);
router.get('/:id', CommunityController.getCommunityById);
router.put('/:id', CommunityController.updateCommunity);
router.delete('/:id', CommunityController.deleteCommunity);

module.exports = router;
