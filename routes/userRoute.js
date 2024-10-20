const router = require('express').Router();
const controller = require('../controllers/userController');

router.post('/verify/code', controller.verify_code);
router.get('/', controller.get_user);
router.post('/otp/trigger', controller.trigger_otp);

module.exports = router;
