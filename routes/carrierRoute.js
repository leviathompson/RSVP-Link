const router = require("express").Router();
const { getCarriers, getCarrierById } = require("../controllers/carrierController");

router.post("/all", getCarriers);
router.post("/id", getCarrierById);

module.exports = router;