const express = require('express');
const app = express();
const port = process.env.PORT || 4444;
require('dotenv').config();
const connectDB = require('./config/db');
const authenticateToken = require('./middleware/authenticateToken'); // Import middleware

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to the database
connectDB();

//=======================================================================
// Setup CORS
app.use(require('cors')());
//=======================================================================
// Setup routes
app.use('/users', require('./routes/publicUserRoute.js'));
app.use('/protected/party', authenticateToken, require('./routes/protectedPartyRoute.js'));
app.use('/protected/users', authenticateToken, require('./routes/protectedUserRoute.js'));
//=======================================================================

// Start the server
app.listen(port, () => {
  console.log("🚀 Listening on port: " + port + " 🚀");
});
