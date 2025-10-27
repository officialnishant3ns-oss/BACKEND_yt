import mongoose from "mongoose"
import mongooseaggregatePaginate from 'mongoose-aggregate-paginate-v2'
const videoschema = new mongoose.Schema({
    videoFile: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    ispublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
    {
        timestamps: true
    })



videoschema.plugin(mongooseaggregatePaginate)
const Video = mongoose.model('Video', videoschema)
export default Video