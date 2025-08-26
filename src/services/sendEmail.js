import nodemailer from 'nodemailer'

export const sendEmail = async({
    to="",
    message="",
    subject="",
    attachments=[]
})=>{
    // connection configration
    let transporter = nodemailer.createTransport({
        host:'localhost', //stmp.gmail.com
        port: 587, // 465
        secure: false,  //true TLS
        service: 'gmail',
        auth:{
            user:process.env.SENDER_EMAIL,
            pass:process.env.SENDER_PASS
        }
    })

    let info = await transporter.sendMail({
        from:`Maged, <${process.env.SENDER_EMAIL}>`,
        to,
        subject,
        html:message,
        attachments:attachments
    })

    if(info.accepted.length){
        return true
    }else{
        return false
    }
}