import userModel from "../../DB/Models/user.model.js"
import { asyncHandler } from "../uitils/errorHandling.js"
import { tokenDecode } from "../uitils/tokenFunctions.js"
const authFunction = async(req,res,next)=>{
    const {token} = req.headers
    if(!token){
        return next( new Error("please Login", {cause:400}))
    }
    if(!token?.startsWith("maged__")){
        return next( new Error("wrong prefix", {cause:400}))
    }
    const seperatedToken = token.split('maged__')[1]
    const decode = tokenDecode({payload:seperatedToken})
    console.log(decode);
    if(!decode?.id){
        return next( new Error("fail to decode", {cause:400}))
    }
    const user = await userModel.findById(decode.id)
    if(!user){
        return next( new Error("fail to get user", {cause:400}))
    }
    req.user = user
    next()
}
export const auth=()=>{
    return asyncHandler(authFunction)
}