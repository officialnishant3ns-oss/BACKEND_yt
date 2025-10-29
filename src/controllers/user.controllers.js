import { asyncHandler } from "../Utils/asynchandler.js"
import { apierror } from "../Utils/apierror.js"
import User from "../models/user.models.js"
import { error } from "console"
import uploadonclodinary from '../Utils/fileUpload.js'
import apiresponse from "../Utils/apiresponse.js"

//method for refesh and access token there
const accessandrefreshtokengenerate = async (userId) => {
  try {
    const user = await User.findById(userId)
    const refreshtoken = await user.generateRefreshToken()
    const accesstoken = await user.generateAccessToken()

    user.refreshtoken = refreshtoken
    user.save({ validateBeforeSave: true })
    return { accesstoken, refreshtoken }
  } catch (error) {
    throw new apierror(500, "something went wrong while generating user")
  }
}




//register portion
const register = asyncHandler(async (req, res) => {

  console.log("st")
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

  if ([username, email, fullname, password].some((field) =>
    field?.trim() === ""
  )) {
    throw new apierror(400, "Something is Missing")
  }
  // if (!fullname || !email || !username || !password) {
  //   throw new apierror(400, "Something is missing")
  // }

  const userexist = await User.findOne({
    $or: [{ username }, { email }]
  })
  if (userexist) {
    throw new apierror(409, "User with emial or Username already exist")
  }

  const avatarlocalpath = await req.files?.avatar[0]?.path
  // const coverimagelocalpath = req.files?.coverimage[0]?.path

  let coverimagelocalpath;
  if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
    coverimagelocalpath = req.files?.coverimage[0]?.path
  }

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
    new apiresponse(200, createduser, "User registered successfully")
  )


})

// login portion 
const loginuser = asyncHandler(async (req, res) => {

  // username,email , password
  //find user 
  //compare check password 
  //access and refresh token genrate
  //send cookie

  const { email, username, password } = req.body

  if (!username && !email) {
    throw new apierror(400, "username or password requied")
  }

  const user =await User.findOne({
    $or: [{ username }, { email }]
  })
  if (!user) {
    throw new apierror(400, "User not found")
  }

  const validpassword = await user.isPassword(password)
  if (!validpassword) {
    throw new apierror(401, "Password not correct there")
  }

  const { refreshtoken, accesstoken } = await accessandrefreshtokengenerate(user._id) // for generating acess and refresh toke there


  const loggegInUser = await User.findById(user._id).select(
    "-password -refresstoken"
  )

  const option = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .cookie("accessToken", accesstoken, option)
    .cookie("refreshToken", refreshtoken, option)
    .json(
      new apiresponse(
        200,
        { user: loggegInUser, accesstoken, refreshtoken },
        "User logged in successfully"
      )
    )

})
export { loginuser, register } 