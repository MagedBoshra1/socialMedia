import userModel from "../../../DB/Models/user.model.js"
import { sendEmail } from "../../services/sendEmail.js"
import { tokenDecode, tokenGeneration } from "../../uitils/tokenFunctions.js"
import bc from 'bcryptjs'
import { nanoid } from "nanoid";

export const signUp = async(req,res,next)=>{
    const {firstName, lastName, userName, email,password, gender}= req.body
    const emailCheck = await userModel.findOne({email}).select("-_id email")
    const userNameCheck = await userModel.findOne({userName}).select("-_id userName")

    if(emailCheck){
        return next(new Error("email is already exist", {cause:409}))
    }
    if(userNameCheck){
        return next(new Error("user name is already exist", {cause:409}))
    }
    const hashedPass = bc.hashSync(password, +process.env.SALETROUNDS)
    const newUser = new userModel({firstName, 
        lastName, 
        userName, 
        email,
        password:hashedPass,
        gender
    })

    const token = tokenGeneration({
        payload:{newUser}
    })
    if(!token){
        return next(new Error("token generation Fail", {cause:409}))
    }
    const confirmationLink = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/confirmLink/${token}`
    const refreshToken = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/refresh/${email}`
    // console.log(confirmationLink);
    const emailSend = await sendEmail({
            to:newUser.email,
            subject: "confirmation E-mail",
            message:`<a href=${confirmationLink}>Click to Confirm</a>
            <br>
            <a href=${refreshToken}>Refresh your token</a>`,
            attachments:[{
                // path:'../../index.js'
                filename:"text.txt"
            }]
        })
    if(!emailSend){
        next(new Error("sending email fail", {cause:500}))
    }
    // const savedUser = await newUser.save()
    return res.json({message:"Sign Up Done, Please Check Your Inbox to Confirm your Email"})
}

//===================== confirmEmail ==============================
export const confirmEmail = async(req,res,next)=>{
    const {token} = req.params
    const decode = tokenDecode({payload:token})
    if(!decode?.newUser){
        return next(new Error("Token Decoded Fail",{cause:400}))
    }
    decode.newUser.confirmed = true
    const confirmedUser = new userModel({
        ...decode.newUser
    })
    await confirmedUser.save()
    const userData = decode
    return res.status(201).json({message:"confirmed Done", userData})
    // console.log(decode);
    // if(decode?._id){
    //     const user = await userModel.findOneAndUpdate(
    //     {_id:decode._id,confirmed:false},
    //     {confirmed:true}
    //     )
    //     if(!user){
    //         return res.status(200).json({message:"Already confirmed"})
    //     }
    //     return res.status(201).json({message:"confirmed Done"})
    // }
    // next(new Error("Error in confirm Email",{cause:400}))
}

//===================== refresh Token ==============================
export const refreshToken = async(req,res,next)=>{
    const {email} = req.params
    const token = tokenGeneration({payload:email}, process.env.TOKEN_SIGNATURE)
    if(token){
        res.status(200).json({message:"Token Done", token})
    }
    next(new Error("Token Fail",{cause:200}))
}

//======================= log in ===========================
export const logIn = async(req,res,next)=>{
        const {email, password}= req.body
        const user = await userModel.findOne({email, isLoggedIn:false, confirmed:true})
        // user = 5
        if(!user){
            return next(new Error("In-valid Information", {cause:400} ))
        }
         // const token = tokenFunction({id:user._id, email:user.email})
        const match = bc.compareSync(password, user.password)
        if(!match){
            return next(new Error("In-valid Password", {cause:400} ))
        }
        const token = tokenGeneration({
            payload:{
                id:user._id, email:user.email, isLoggedIn:true
            }})
        
        const loggenUser = await userModel.findOneAndUpdate({email}, {isLoggedIn:true})
        if(!loggenUser){
            return next(new Error("Please Log In Again!", {cause:400} ))
        }
        res.status(200).json({message:"Login succss", token})
}

//======================== Log out ===================================
export const logOut = async(req,res,next)=>{
    const {_id} = req.user
    const user = await userModel.findByIdAndUpdate(_id,{
        isLoggedIn:false
    })
    if(user){
        return res.status(200).json({message:"logged out"})
    }
    next(new Error("Error in logging out!"))
}


//======================= forget password =============================
export const forgetPassword = async (req, res, next ) => {
    const { email } = req.body;
    const emailExist = await userModel.findOne({ email })
    if (!emailExist) {
        return  next (new Error ("In-valid Email", {cause:400}))
    }
    const token = tokenGeneration({payload:{_id:emailExist._id}})
    const resetLink = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/resetPass/${token}`
    const sentEmail =  await sendEmail({ 
        to: emailExist.email, 
        subject:"reset password", 
        message :`<a href="${resetLink}">Click to Reset your Password</a>`,
    })
    if(!sentEmail){
        return  next (new Error ("Email didn't sent", {cause:400}))
    }
    return res.status(202).json({ message: "check your email" })
}


//==================== change Password =======================
export const resetPassword = async (req, res, next) => {
    const {token} = req.params
    const {newPassword} = req.body
    const decode = tokenDecode({payload:token})
    console.log(decode);
    if(!decode?._id){
        return next(new Error("Token Decoded Fail",{cause:400}))
    }
    const hashedPassword = bc.hashSync(newPassword, +process.env.SALT_ROUNDS)
    const user = await userModel.findOneAndUpdate({_id:decode._id}, {
        password:hashedPassword
    })
    if(!user){
        return  next (new Error ("Fail in reset Password", {cause:400}))
    }
    return res.status(202).json({ message: "Done, PLease try to Login!" })
}

