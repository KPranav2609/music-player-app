import ImageKit from "imagekit";//importing ImageKit library
import dotenv from 'dotenv';
dotenv.config();//configuring dotenv to use .env file

const imagekit = new ImageKit({ //creating an instance of ImageKit with credentials from environment variables
    publicKey : process.env.imagekit_public_key,
    privateKey : process.env.imagekit_private_key,
    urlEndpoint : process.env.imagekit_url_endpoint
});     
export default imagekit;//exporting the imagekit instance