const mongoose = require('mongoose');
const Carrier = require('../models/carrierModel');
const connectDB = require('../config/db');
require('dotenv').config();

connectDB();

const carriers = [
  { name: 'Bell Canada', smsGatewayDomain: 'txt.bell.ca' },
  { name: 'Bell MTS (Manitoba)', smsGatewayDomain: 'text.mts.net' },
  { name: 'Fido Solutions', smsGatewayDomain: 'fido.ca' },
  { name: 'Freedom Mobile', smsGatewayDomain: 'txt.freedommobile.ca' },
  { name: 'Koodo Mobile', smsGatewayDomain: 'msg.telus.com' },
  { name: 'PC Mobile', smsGatewayDomain: 'mobiletxt.ca' },
  { name: 'SaskTel', smsGatewayDomain: 'sms.sasktel.com' },
  { name: 'Lüm Mobile', smsGatewayDomain: 'sms.sasktel.com' },
  { name: 'Telus', smsGatewayDomain: 'msg.telus.com' },
];

Carrier.insertMany(carriers)
  .then(() => {
    console.log('Carriers seeded successfully');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error seeding carriers:', error);
    mongoose.connection.close();
  });

