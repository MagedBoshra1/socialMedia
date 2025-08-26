import { connectionDB } from "../../DB/connection.js";
import * as allRouters from '../modules/index.routers.js'
import { stackCatch } from "./errorHandling.js";
import schedule from 'node-schedule'


export const initiateApp = (app, express)=>{
    
    // listen
    const port = +process.env.PORT || 5000
    const baseUrl = process.env.BASE_URL
    // express
    app.use(express.json())
    // routing
    app.use(`${baseUrl}/uploads`, express.static('../../uploads'))
    app.use(`${baseUrl}/user`, allRouters.userRouter)
    app.use(`${baseUrl}/auth`, allRouters.authRouter)
    app.use(`${baseUrl}/post`, allRouters.postRouter)
    app.use(`${baseUrl}/comment`, allRouters.commentRouter)
    app.use('*', (req,res)=>{
        res.status(404).json({message:"NOT FOUND"})
    })
    // Error handling
    app.use((err,req,res,next)=>{
        if(err){
            if(process.env.ENV_MODE == 'env'){
                return res.status(err['cause'] || 500).json({message:"Fail Response", Error:err.message, stack:stackCatch })
            }
            return res.status(err['cause'] || 500).json({message:"Fail Response", Error:err.message})
        }
    })

    const cronJob = schedule.scheduleJob('* * * * * *', function(){
        console.log("Maged");
    })
    const recurrenceRule = new schedule.RecurrenceRule()
    recurrenceRule.second = 40
    const job = schedule.scheduleJob(recurrenceRule, function(){
        console.log("Maged in the second 40");
    })
    schedule.gracefulShutdown()
    // connectionDB
    connectionDB()
    app.listen(port, console.log(`listening on ${port} >>>>>>>>>>>>>>>>>>>>>>>`));
}