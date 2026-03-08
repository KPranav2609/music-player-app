import mongoose from "mongoose";
import bcrypt from "bcrypt";//importing bcrypt for password hashing
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    avatar: {
        type: String,
        default: ""
    },
    resetPasswordToken: String,
    resetPasswordTokenExpires: Date,

    favourites: [{
        id:{ type: String, required: true },
        name:String,
        artist_name:String,
        image:String,
        audio:String,
        duration:String,
    },],
});

//pre-save hook to hash password before saving user document
userSchema.pre('save', async function() {
    if(!this.isModified('password')) {
        return;
    }   
    const salt= await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password,salt);
}); 


userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);//creating a mongoose model named 'User' using the userSchema
export default User;

