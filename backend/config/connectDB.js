import mangoose from "mongoose";//importing mongoose module to interact with mongoDb
import dotenv from "dotenv";//importing dotenv module to manage environment variables
dotenv.config({path:'../.env'});//configuring dotenv to use .env file
const connectDB = async () => {     //function to connect to mongoDb
    try {
      const connection = await mangoose.connect(process.env.MANGODB_URL);//connecting to mongoDb using the connection string from environment variable
      console.log("mongoDb connected: ", connection.connection.host);
    } catch (error) {
        console.error("mongoDb connection failed", error.message);
    }

};
export default connectDB;//exporting the connectDB function