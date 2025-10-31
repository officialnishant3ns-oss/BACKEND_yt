import { asyncHandler } from "../Utils/asynchandler.js"
import { apierror } from "../Utils/apierror.js"
import apiresponse from "../Utils/apiresponse.js"
import jwt from "jsonwebtoken"
import User from "../models/user.models.js"


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new apierror(401, "unauthoreised request there")
        }

        const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedtoken?._id).select(
            "-password -refresstoken"
        )
        if (!user) {
            throw new apierror(401, "invalid Access token")
        }
        req.user = user
        next()
    } catch (error) {
  next(new apierror(401, "Invalid or expired token"))
    }
})
export default verifyJWT