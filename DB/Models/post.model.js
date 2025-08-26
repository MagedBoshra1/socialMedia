import { Schema, model } from "mongoose";


const postSchema = new Schema({
    title:String,
    postBody:{
        type:String,
        required:true
    },
    images:[{
        type:String
    }],
    publicIds:[{
        type:String
    }],
    likes:[{
        type: Schema.Types.ObjectId,
        ref:'User'
    }],
    unlikes:[{
        type: Schema.Types.ObjectId,
        ref:'User'
    }],
    createdBy:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }
},{
    timestamps:true
})



const postModel = model.User || model('Post', postSchema)

export default postModel