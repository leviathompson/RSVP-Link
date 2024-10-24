const router = require('express').Router();
const controller = require('../controllers/protectedUserController');

router.get('/', controller.get_user);
router.patch('/', controller.patch_user);

module.exports = router;