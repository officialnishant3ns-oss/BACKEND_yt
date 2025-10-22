import mongoose from "mongoose"

const userschema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
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
        type: String,  //caloudinary
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

const User = mongoose.model('User', userschema)
export default User