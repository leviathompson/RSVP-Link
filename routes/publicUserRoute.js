const router = require('express').Router();
const controller = require('../controllers/publicUserController');

router.get('/', controller.get_user);

router.post('/verify/code', controller.verify_code);
router.post('/otp/trigger', controller.trigger_otp);
router.post('/login', controller.login);

module.exports = router;
