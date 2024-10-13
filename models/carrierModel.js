const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Schema = mongoose.Schema;

const CarrierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  smsGatewayDomain: {
    type: String,
    required: true,
  },
});

const Carrier = mongoose.model("Carrier", CarrierSchema);
module.exports =  Carrier;
