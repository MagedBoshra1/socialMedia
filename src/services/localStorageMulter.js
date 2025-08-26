import multer from 'multer'
import { nanoid } from 'nanoid'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import fs from 'fs'

export const validationTypes = {
    image:["image/png", "image/jpg", "image/jpeg"],
    files:["application/pdf", "application/rtf"]
}

// export const myMulter = ({
//     customValidation=validationTypes.image, 
//     customPath="general"}={})=>{
//     const fullPath = path.join(__dirname, `../../uploads/${customPath}`)
//     if(! fs.existsSync(fullPath)){
//         fs.mkdirSync(fullPath, {recursive:true})
//     }
//     const storage= multer.diskStorage({
//         destination:(req,file,cb)=>{
//             cb(null, fullPath)
//         },
//         filename:(req,file,cb)=>{
//             const uniqueName = nanoid() + '_' + file.originalname
//             cb(null, uniqueName)
//         }
//     })
//     const fileFilter = (req,file,cb)=>{
//         if(customValidation.includes(file.mimetype)){
//             return cb(null, true)
//         }
//         cb(new Error("in-valid Extension", {cause:400}), false)
//     }
//     const upload = multer({fileFilter,storage})
//     return upload
// }

export const myMulter = ({
    customValidation=validationTypes.image}={})=>{
    const storage= multer.diskStorage({})
    const fileFilter = (req,file,cb)=>{
        if(customValidation.includes(file.mimetype)){
            return cb(null, true)
        }
        cb(new Error("in-valid Extension", {cause:400}), false)
    }
    const upload = multer({fileFilter,storage})
    return upload
}
