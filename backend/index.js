import express from 'express';//importing express module
import dotenv from 'dotenv';//importing dotenv module to manage environment variables
import cors from 'cors';//importing cors module to handle cross-origin requests
import connectDB from './config/connectDB.js';//importing the connectDB function to connect to mongoDb
import router from './routes/authRoutes.js';
import songrouter from './routes/songRoutes.js';

dotenv.config();//configuring dotenv to use .env file
const PORT=process.env.PORT || 5001;//setting the port from environment variable or default to 3000

const app = express();//creating an express application
app.use(express.json());//middleware to parse JSON request bodies
connectDB();//calling the function to connect to mongoDb

app.use(cors({
    origin: ["http://localhost:5173","https://music-player-app-kohl-psi.vercel.app"],
     // Allow requests from this origin
    credentials: true, // Allow cookies and credentials
}));


app.use('/api/songs',songrouter);//using the song routes for /api/songs endpoint
app.use('/api/auth',router);//using the auth routes for /api/auth endpoint
app.listen(PORT,()=>console.log(`server is running on port ${PORT}`));//starting the server on port 3000