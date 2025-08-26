import { Schema, model } from "mongoose";


const productSchema = new Schema({
    title:String,
    Caption:String,
    images:[{
        type:String,
        required:true
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



const productModel = model.User || model('Product', productSchema)

export default productModel