import mongoose from "mongoose"
import JsonWebToken from "jsonwebtoken"
import bcrypt from 'bcrypt'
const userschema = new mongoose.Schema({
    username: {
        type: String,
        required: [true,"Username is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,  //cloudinary
        required: true
    },
   coverimage: {
        type: String
    }, 
    watchhistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "video"
        }
    ],
    password: {
        type: String,
        required: [true, 'password is requred']
    },
    refresstoken: {
        type: String
    }
},
    {
        timestamps: true
    })


    userschema.pre("save", async function (next) {
        if(!this.isModified("password")) return next()
        this.password = bcrypt.hash(this.password,10)
        next()
    })
const User = mongoose.model('User', userschema)
export default User