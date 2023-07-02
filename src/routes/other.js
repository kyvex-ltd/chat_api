const
    express = require('express'),
    router = express.Router(),
    otherController = require('../controllers/otherController');

router.get('/getUserCount', otherController.getUserCount);
router.get('/getCommunityCount', otherController.getCommunityCount);
router.get('/ping', otherController.ping);

module.exports = router;