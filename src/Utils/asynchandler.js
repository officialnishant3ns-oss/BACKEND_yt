const asyncHandler = (func) => async (req, res, next) => {
    try {
        await func(req, res, next);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            errors: error.errors || []

        })
    }
}
export {asyncHandler}






// const asyncHandler = (requestHandler)=>{
//   return  (req,res,next)=>{
//         Promise.resolve(requestHandler(req,res,next))
//         .catch((error)=>next(error))
//     }
// }
// export {asyncHandler} 

/*
//try and catch vala hai ye method ji
const asyncHandler = (fn)=> async(req,res,next)=>{ // fuction pases to another async function
    try{
       await fn(req,res,next)
    }catch(error){
      res.status(error.code ||500).json({
        success:false  ,
        message:error.message
      })
    }
}      
    */