const
    express = require('express'),
    router = express.Router(),
    CategoryController = require('../controllers/categoryController');

router.post('/create', CategoryController.createCategory)
router.get('/:id', CategoryController.getCategoryById)
router.put('/:id', CategoryController.updateCategory)
router.delete('/:id', CategoryController.deleteCategory)

module.exports = router;
