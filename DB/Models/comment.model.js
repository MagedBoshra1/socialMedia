import { Schema, model } from "mongoose";


const commentSchema = new Schema({
    commentBody:{
        type:String,
        required:true
    },
    commentBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    productId:{
        type:Schema.Types.ObjectId,
        ref:'Product'
    },
    postId:{
        type:Schema.Types.ObjectId,
        ref:'Post'
    }
},{
    timestamps:true
})



const commentModel = model.User || model('Comment', commentSchema)

export default commentModel