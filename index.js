const express = require('express');
const app = express();
const port = process.env.PORT || 4444;
require('dotenv').config();
const connectDB = require('./config/db');

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to the database
connectDB();

//==========================================================================
// Setup CORS
app.use(require('cors')());
//==========================================================================
// Setup routes
app.use('/users', require('./routes/userRoute.js'));
//==========================================================================

// Start the server
app.listen(port, () => {
    console.log("🚀 Listening on port: " + port + " 🚀");
});
