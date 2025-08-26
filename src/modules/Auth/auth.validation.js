import joi from 'joi'

export const signUpValidation = {
    body: joi.object().required().keys({
        firstName: joi.string().required().alphanum().messages({'string.base':"please enter valid name"}),
        lastName: joi.string().required().alphanum().messages({'string.base':"please enter valid name"}),
        userName: joi.string().required().alphanum().messages({
            'string.base':"please enter valid name",
            'string.empty': 'Name is required',
            'any.required': 'Name is required'
        }),
        email: joi.string().email().required(),
        password: joi.string().required(),
            // .messages({
            //     "string.min": "password must contain at least 5 charachters",
            //     "string.pattern.base": "Password must match the regex"
            // }),
        rePassword: joi.string().required().valid(joi.ref("password")),
        gender:joi.string().optional()
    })
}

export const confirmEmailSchema = {
    params: joi.object().required().keys({
        token: joi.string().required()
    })
}

export const logInSchema = {
    body: joi.object().required().keys({
        email: joi.string().required(),
        password: joi.string().required()
        // .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    })
}

export const changePassSchema ={

    body:joi.object().required().keys({
    email:joi.string().required().email({
        tlds :{allow:["com","net"] }, maxDomainSegments:2 
        }).messages(
            {"string.email" : " this format in not valid "},
            {"any.required":" please ensert your mail"}
        ),
    newpassword : joi.string().required()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .messages(
        {"string.min":"paswword must be be at lest 5 items",
        "string.pattern.base":"password must match the regex"
        }),
    cpassword:joi.string().valid(joi.ref("password")).required().messages({
        "any.only":" the confirmaion password does'nt match password"
    }),
})

}