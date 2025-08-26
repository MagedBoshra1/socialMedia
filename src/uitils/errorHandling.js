let stackCatch
export const asyncHandler = (API)=>{
    return(req,res,next)=>{
        API(req,res,next).catch(err=>{
            if(err.code == 11000){
                return next(new Error("email is already exist", {cause:409}))
            }
            stackCatch= err.stack
            next(new Error(err.message))
        })
    }
}

export {stackCatch}