import mongoose from "mongoose";
import { config } from "dotenv";
config({path:'../config/dev.env'})

export const connectionDB = async()=>{
    return await mongoose
    .connect(process.env.DB_LOCAL_URL)
    .then((res)=>console.log("DB Connected"))
    .catch((err)=>console.log("DB not Connected"))
}