import { asyncHandler } from "../Utils/asynchandler.js"
import { apierror } from "../Utils/apierror.js"
import User from "../models/user.models.js"
import uploadonclodinary from '../Utils/fileUpload.js'
import apiresponse from "../Utils/apiresponse.js"
import jwt from "jsonwebtoken"


const accessandrefreshtokengenerate = async (userId) => {
  try {
    const user = await User.findById(userId)
    const refreshtoken = await user.generateRefreshToken()
    const accesstoken = await user.generateAccessToken()

    user.refreshtoken = refreshtoken
    await user.save({ validateBeforeSave: true })
    return { accesstoken, refreshtoken }
  } catch (error) {
    throw new apierror(500, "something went wrong while generating user")
  }
}

const register = asyncHandler(async (req, res) => {

  //get user data from frontend >
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

  if ([username, email, fullname, password].some((field) =>
    field?.trim() === ""
  )) {
    throw new apierror(400, "Something is Missing")
  }

  const userexist = await User.findOne({
    $or: [{ username }, { email }]
  })
  if (userexist) {
    throw new apierror(409, "User with email or Username already Exist")
  }

  const avatarlocalpath = await req.files?.avatar[0]?.path
  // const coverimagelocalpath = req.files?.coverimage[0]?.path

  let coverimagelocalpath
  if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
    coverimagelocalpath = req.files?.coverimage[0]?.path
  }

  if (!avatarlocalpath) {
    throw new apierror(400, "Avatar local path is required.. ")
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

  const user = await User.findOne({
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
    .cookie("accesstoken", accesstoken, option)
    .cookie("refreshtoken", refreshtoken, option)
    .json(
      new apiresponse(
        200,
        { user: loggegInUser, accesstoken, refreshtoken },
        "User logged in successfully"
      )
    )

})

const logOut = asyncHandler(async (req, res) => {
  //cookies clear
  // refresh token remove there 

  User.findByIdAndUpdate(req.user._id,
    {
      $set: {
        refreshtoken: undefined
      }
    }, {
    new: true
  }
  )
  const option = {
    httpOnly: true,
    secure: true
  }
  return res.status(200).clearCookie("accesstoken", option)
    .clearCookie("refreshtoken", option).json(
      new apiresponse(200, {}, "User logged out")
    )

})

const AccesstokenRefreshtoken = asyncHandler(async (req, res) => {
  try {

    const incomingrefeshtoken = req.cookie.refreshtoken || req.body.refreshtoken
    if (!incomingrefeshtoken) {
      throw new apierror(401, "Unauthorised request")
    }
    const decodedtoken = jwt.verify(
      incomingrefeshtoken, process.env.REFRESH_TOKEN_SECRET
    )
    const user = await User.findById(decodedtoken?._id)
    if (!user) {
      throw new apierror(401, "invalid refresh token")
    }

    if (incomingrefeshtoken != user?.refreshtoken) {
      throw new apierror(401, "invalid refresh expired token")
    }

    const { accesstoken, newrefreshtoken } = await accessandrefreshtokengenerate(user._id)

    const option = {
      httpOnly: true,
      secure: true
    }

    return res.status(200).
      cookie("accesstoken", accesstoken, option).
      cookie("refreshtoken", newrefreshtoken, option).
      json(
        new apiresponse(200, { accesstoken, refreshtoken: newrefreshtoken }, "Access token refreshed there")
      )
  } catch (error) {
    throw new apierror(401, "invalid refesh token")
  }

})

const changeUserCurruntPassword = asyncHandler(async (req, res) => {
  const { oldpassword, newpassword } = req.body

  const user = await User.findOne(req.user?._id)
  if (!user) {
    throw new apierror(400, "User Does not exist")
  }
  const isPasswordcorrect = user.isPassword(oldpassword)
  if (!isPasswordcorrect) {
    throw new apierror(400, "invalid old password")
  }

  user.password = newpassword
  await user.save({ validateBeforeSave: false })

  return res.status(200).json(
    new apiresponse(200, {}, "password change successfuly")
  )

}
)

const getcorrentUSer = asyncHandler(async (req, res) => {
  return res.status(200).json(200, req.user, "current user is fetched successfully")
}
)

const updateAccoutDetail = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body

  if (!fullname || !email) {
    throw new apierror(400, "Something is missing, All field is requred")
  }

  const user = User.findById(req.user?._id,
    {
      $set: {
        fullname: fullname,
        email: email
      }
    },
    { new: true }
  ).select("-password")

  return res.status(200).json(
    new apiresponse(200, "Accout details Updated")
  )
}
)

const updateAvatar = asyncHandler(async (req, res) => {
  const avatarlocalpath = req.file?.path
  if (!avatarlocalpath) {
    throw new apierror(400, "avatar files is missing")
  }

  const avatar = await uploadonclodinary(avatarlocalpath)
  if (!avatar.url) {
    throw new apierror(400, "Error while uploading ")
  }

  const user = await User.findById(req.user?._id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    { new: true }
  ).select("-password")

  return res.status(200).json(
    new apiresponse(200, "avatar updated successfully", user)
  )
}
)

const updateCoverimage = asyncHandler(async (req, res) => {
  const coverimagelocalpath = req.file?.path
  if (!coverimagelocalpath) {
    throw new apierror(400, "coverimage files is missing")
  }

  const coverimage = await uploadonclodinary(coverimagelocalpath)
  if (!coverimage.url) {
    throw new apierror(400, "Error while uploading ")
  }

  const user = await User.findById(req.user?._id,
    {
      $set: {
        coverimage: coverimage.url
      }
    },
    { new: true }
  ).select("-password")

  return res.status(200).json(
    new apiresponse(200, "coverimage updated successfully", user)
  )
}
)

//advanced aggregation pipeline there
const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params
  if (!username.trim()) {
    throw new apierror(400, "Username is required")
  }
  const channel = await User.aggregate([
    {
      $match: {
        username: username.trim()
      }
    },
    {
      $lookup: {
        from: "Subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      }
    },
    {
      $lookup: {
        from: "Subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedchannels"
      }
    },
    {
      $addFields: {
        subscribecount: {
          $size: "$subscribers"
        },
        channelsubcribedcount: {
          $size: "$subscribedchannels"
        }
      },
      issubscribed: {
        $cond: {
          if: { $in: [req.user?._id, "$subscribers.subscriber"] },
          then: true,
          else: false,
          subscribecount: 1,
          channelsubcribedcount,
          avatar: 1,
          coverimage: 1,
          email: 1

        }
      }
    },
    {
      $project: {
        fullname: 1,
        username: 1,

      }
    }
  ])

  if(!channel || channel.length ===0){
    throw new apierror (404,"Channel not found")
  }
  return res.status(200).json(
    new apiresponse(200, channel[0], "Channel profile fetched successfully")
  )
})


export { loginuser, register, logOut, AccesstokenRefreshtoken, getcorrentUSer, changeUserCurruntPassword, updateAccoutDetail, updateAvatar, updateCoverimage, getUserChannelProfile } 