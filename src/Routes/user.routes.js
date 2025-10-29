import { Router } from "express"
import register from "../controllers/user.controllers.js"
import upload from "../Middleware/multer.middleware.js"

const router = Router()
// router.post('/register',register)
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverimage", maxCount: 1 },
    ]),
    register
)


export default router
