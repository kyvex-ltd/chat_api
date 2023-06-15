const
    express = require('express'),
    router = express.Router(),
    otherController = require('../controllers/otherController');

router.get('/getUserCount', otherController.getUserCount);
router.get('/getCommunityCount', otherController.getCommunityCount);

module.exports = router;