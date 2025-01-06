import express, {Express} from 'express'
const app = express() // Create an Express application
import dotenv from 'dotenv'// Load environment variables from a.env file
dotenv.config() 
const port = process.env.PORT  // Get the port from the environment variables or default to 5000
import postRoutes from './routes/postRoutes'; // Import the post routes
import commentRoutes from './routes/commentRoutes'; // Import the comment routes
import mongoose from 'mongoose'; // Import mongoose
import bodyParser from 'body-parser'; // Import body-parser



const initApp = () => {
    return new Promise<Express>((resolve, reject) => {
      const db = mongoose.connection;
      db.on("error", (err) => {
        console.error(err);
        reject(err);
      });
      db.once("open", () => {
        console.log("Connected to MongoDB");
      });

        // Connect to the database
        mongoose.connect(process.env.DB_CONNECT).then(() => {
            
            // Use body-parser middleware
            app.use(bodyParser.json()); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
            app.use(bodyParser.urlencoded({ extended: true })); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.

            // Use the post routes
            app.use('/post', postRoutes);

            app.use('/comment', commentRoutes);

            console.log("initApp finish");
              
            resolve(app);

        });

})};


export default initApp;
