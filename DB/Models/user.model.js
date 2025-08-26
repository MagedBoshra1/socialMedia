import { Schema, model } from "mongoose";
import bc from 'bcryptjs'



const userSchema = new Schema({
    firstName:String,
    lastName:String,
    userName:{
        type:String,
        unique:true
    },
    email:{
        type:String,
        unique:true
    },
    password:String,
    gender:{
        type:String,
        enum:['male','female']
    },
    profile_pic:String,
    public_id:String,
    cover_pictures:[{
        type:String
    }],
    isLoggedIn:{
        type:Boolean,
        default:false
    },
    confirmed:{
        type:Boolean,
        default:false
    },
    code:String,
    resetcode:String
},{
    timestamps:true
})

// userSchema.pre('save', function(next,doc){
//     this.password = bc.hashSync(this.password, +process.env.SALT_ROUNDS)
//     next()
// })


const userModel = model.User || model('User', userSchema)

export default userModel