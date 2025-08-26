import jwt from 'jsonwebtoken'


export const tokenGeneration = ({
    payload = {},
    signature = process.env.TOKEN_KEY,
    generate = true
})=>{
    if(Object.keys(payload).length){
        const token = jwt.sign(payload, signature)
        return token
    }
    return false
}

export const tokenDecode = ({
    payload = '',
    signature = process.env.TOKEN_KEY
    
})=>{
    if(!payload){
        return false
    }
    // console.log(payload, signature);
    const decode = jwt.verify(payload, signature)
    return decode

}
