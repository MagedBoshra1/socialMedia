import Router from 'express'
import { auth } from '../../middlewares/Auth.js'
import { validation } from '../../middlewares/validation.js'
import { asyncHandler } from '../../uitils/errorHandling.js'
const router = Router()
import * as authcontroller from './auth.controller.js'
import * as validationSchema from './auth.validation.js'

router.post("/signup",validation(validationSchema.signUpValidation) ,asyncHandler(authcontroller.signUp))
router.get('/confirmLink/:token',validation(validationSchema.confirmEmailSchema),asyncHandler(authcontroller.confirmEmail))
router.get('/refresh/:email',asyncHandler(authcontroller.refreshToken))
router.post('/login', validation(validationSchema.logInSchema),asyncHandler(authcontroller.logIn))
router.post('/logout',auth(),asyncHandler(authcontroller.logOut))
router.get("/forgetpassword", asyncHandler(authcontroller.forgetPassword))
router.get("/resetPass/:token", asyncHandler(authcontroller.resetPassword))

export default router