const router = require('express').Router();
const controller = require('../controllers/protectedPartyController');

router.get('/', controller.get_party);

module.exports = router;