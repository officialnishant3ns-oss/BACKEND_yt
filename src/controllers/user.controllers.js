import { asyncHandler } from "../Utils/asynchandler.js"
import { apierror } from "../Utils/apierror.js"
import User from "../models/user.models.js"
import { error } from "console"
import uploadonclodinary from '../Utils/fileUpload.js'
import apiresponse from "../Utils/apiresponse.js"

const register = asyncHandler(async (req, res) => {
  // res.status(200).json({ message: "ok" })

  //get uer data from frontend >
  // check that user deytails exist or not empty >
  //check user already exist or not  validation >
  //check for image check for avatar
  //upload on clodinary there
  //create user object 
  //create entry in db
  //remove pass and refresh token field form there 
  //save that
  //check for user created or not 
  // give response 

  const { username, email, fullname, password } = req.body
  console.log("email::", email)

  // if ([username,email,fullname,password].some((field)=>
  //   field?.trim() ===""
  // )) {
  //     throw new apierror(400,"Something is Missing")
  // }
  if (!fullname || !email || !username || !password) {
    throw new apierror(400, "Something is missing")
  }

  const userexist = User.findOne({
    $or: [{ username }, { email }]
  })
  if (userexist) {
    throw new apierror(409, "User with emial or Username already exist")
  }

  const avatarlocalpath = req.files?.avatar[0]?.path
  const coverimagelocalpath = req.files?.coverimage[0]?.path

  if (!avatarlocalpath) {
    throw new apierror(400, "Avatar is required.. ")
  }

  const avatar = await uploadonclodinary(avatarlocalpath)
  const coverimage = await uploadonclodinary(coverimagelocalpath)
  if (!avatar) {
    throw new apierror(400, "Avatar is required.. ")
  }
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverimage: coverimage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  const createduser = await User.findById(user._id).select(
    "-password -refresstoken"
  )
  if (!createduser) {
    throw new apierror(500, "something went wrong while registering the user")
  }

   return res.status(201).json(
   new apiresponse(200,createduser,"User registered successfully")
 )


})

export default register
