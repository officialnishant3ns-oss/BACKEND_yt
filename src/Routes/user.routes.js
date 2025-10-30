import { Router } from "express"
import {loginuser, logOut, register} from "../controllers/user.controllers.js"
import upload from "../Middleware/multer.middleware.js"
import verifyJWT from "../Middleware/auth.middleware.js"

const router = Router()
// router.post('/register',register)
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverimage", maxCount: 1 },
    ]),
    register
)
router.route('/login').post(loginuser)

//securd routes
router.route('/logout').post(verifyJWT,logOut)

export default router
