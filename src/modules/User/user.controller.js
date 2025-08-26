import userModel from "../../../DB/Models/user.model.js"
import cloudinary from "../../services/cloudinary.js"



export const multerStorage = (req,res,next)=>{
    const {name } =req.body
    res.json({message:"Done", file:req.files})
}

//==================profile picture===============================
export const uploadProfilePictureLocally = async(req,res,next)=>{
    if(!req.file){
        next(new Error("please select your Picture", {cause:400}))
    }
    const {_id} = req.user
    const user = await userModel.findByIdAndUpdate(_id,{
        profile_pic:req.file.path
    })
    if(!user){
        next(new Error("please select your Picture", {cause:400}))
    }
    return res.status(202).json({ message: "Done" })
}
//==================cover picture===============================

export const uploadCoverPicturesLocally = async(req,res,next)=>{
    if(!req.files.length){
        next(new Error("please select your Pictures", {cause:400}))
    }
    const {_id} = req.user
    let coverArray = []
    for (let file in req.files) {
        coverArray.push(file.path)
    }
    const user = await userModel.findById(_id)
    if(!user){
        next(new Error("please select your Picture", {cause:400}))
    }
    const userUpdated = await userModel.updateOne({_id},
        {
            cover_pictures:[...user.cover_pictures,...coverArray]
        }
        )
    userUpdated.modifiedCount 
        ? res.status(202).json({ message: "Done" })
        : next (new Error("Fail to add cover photos", {cause:400}))
}

//================== Cloud Profile Picture ===============================

export const uploadProfileCloud = async(req,res,next)=>{
    if(!req.file){
        next(new Error("please select your Picture", {cause:400}))
    }
    const {userName,_id} = req.user
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,{
        folder: `images/${userName}/profile picture`,
        public_id: req.file.filename + Date.now()
    })
    // console.log(image);
    const user = await userModel.findByIdAndUpdate(_id,{
        profile_pic: secure_url,
        public_id:public_id
    })
    if(!user){
        next(new Error("please select your Picture", {cause:400}))
    }
    return res.status(202).json({ message: "Profile Picture Added Done", user })
    
}

//================== Cloud Cover Picture ===============================

export const uploadCoverCloud = async(req,res,next)=>{
    if(!req.files.length){
        next(new Error("please select your Picture", {cause:400}))
    }
    let cover_Arr = []
    const {userName,_id} = req.user
    for(const file of req.files){
        const {secure_url} = await cloudinary.uploader.upload(file.path,{
            folder: `images/${userName}/Covers`
        })
        cover_Arr.push(secure_url)
    }
    const user = await userModel.findByIdAndUpdate(_id,{
        cover_pictures: cover_Arr
    })
    if(!user){
        next(new Error("please select your Picture", {cause:400}))
    }
    return res.status(202).json({ message: "Cover Picture Added Done", user })
}