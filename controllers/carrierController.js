const Carrier = require("../models/carrierModel");

const getCarriers = async (req, res) => {
  try {
    const carriers = await Carrier.find();
    return res.json({ ok: true, carriers: carriers });
  } catch (error) {
    console.error("Error getting carriers:", error);
    return res.json({ ok: false, message: "Failed to get carriers:" });
  }
};

const getCarrierById = async (req, res) => {
    const { id } = req.body;
  try {
    const carrier = await Carrier.findById(id);
    return res.json({ ok: true, carrier: carrier });
  } catch (error) {
    console.error("Error getting carrier:", error);
    return res.json({ ok: false, message: `Failed to get carrier by Id: ${id}` });
  }
};

module.exports = { getCarriers, getCarrierById };
