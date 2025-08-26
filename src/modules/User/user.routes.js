import Router from 'express'
import { myMulter, validationTypes } from '../../services/localStorageMulter.js'
import { asyncHandler } from '../../uitils/errorHandling.js'
import * as userController from './user.controller.js'
import { auth } from '../../middlewares/Auth.js'
const router = Router()



router.patch("/localmulter",
 myMulter([...validationTypes.image, ...validationTypes.files])
.array("files")
,asyncHandler(userController.multerStorage))

router.patch(
"/profilePicLocal",
auth,
myMulter({
    customValidation:validationTypes.image,
    customPath:"user/profile"
})
    .single('profile'),
    userController.uploadProfilePictureLocally
)

router.patch(
    "/coverpic",
    myMulter({
        customValidation:validationTypes.image,
        customPath:"user/cover"
    })
        .array('cover'),
        userController.uploadCoverPicturesLocally
    )

router.patch("/profilePicCloud",auth(),myMulter({customValidation:validationTypes.image})
        .single('profile'),
        asyncHandler(userController.uploadProfileCloud)
)

router.patch("/coverPicCloud",auth(),myMulter({customValidation:validationTypes.image})
        .array('cover'),
        asyncHandler(userController.uploadCoverCloud)
)

export default router
