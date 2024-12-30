// Shay Mashiah - 318877263
// Omri Ivry - 314806357

const express = require('express')
const app = express() // Create an Express application
const dotenv = require('dotenv').config() // Load environment variables from a.env file
const port = process.env.PORT  // Get the port from the environment variables or default to 5000
const POST = require('./controllers/post'); // Import the post routes
const postRoutes = require('./routes/postRoutes'); // Import the post routes
const commentRoutes = require('./routes/commentRoutes'); // Import the comment routes
const mongoose = require('mongoose'); // Import mongoose
const bodyParser = require('body-parser'); // Import body-parser

// Connect to the database
mongoose.connect(process.env.DB_CONNECT);  
const db = mongoose.connection;
mongoose.connection.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to database'));


// Use body-parser middleware
app.use(bodyParser.json()); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.urlencoded({ extended: true })); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.


// Use the post routes
app.use('/post', postRoutes);

app.use('/comment', commentRoutes);

app.listen(port, () => {
    console.log('Server is running on port 5000');
});
