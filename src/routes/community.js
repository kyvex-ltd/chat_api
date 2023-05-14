const
    express = require('express'),
    router = express.Router(),
    CommunityController = require('../controllers/communityController');


router.post('/', CommunityController.create);
router.get('/', CommunityController.get);
router.put('/:id', CommunityController.update);
router.delete('/:id', CommunityController.remove);

module.exports = router;
