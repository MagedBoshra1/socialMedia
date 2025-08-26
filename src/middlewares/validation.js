export const validation = (schema)=>{
    let validationErrorsArr = []
    return(req,res,next)=>{
        const requestKeys = ["body","params","headers","query","file","files"]
        for(const key of requestKeys){
            if(schema[key]){
                const validationResult = schema[key].validate(req[key], {abortEarly:false})
                // res.json({message:"validation result", validationResult})
                if(validationResult?.error?.details){
                    validationErrorsArr.push(validationResult.error.details)
                }
            }
        }
        if(validationErrorsArr.length){
            return res.json({
                message : "validation Error",
                Errors: validationErrorsArr
                })
        }
        next();
    }
    
}