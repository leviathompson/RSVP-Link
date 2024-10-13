const router = require('express').Router();
const controller = require('../controllers/userController');

router.post('/carrier', controller.get_carrier);
router.post('/enter', controller.login);
router.post('/verify', controller.verify_token);

module.exports = router;
