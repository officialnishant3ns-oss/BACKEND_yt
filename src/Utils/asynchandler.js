
const asyncHandler = (requestHandler)=>{
  return  (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((error)=>next(error))
    }
}
export {asyncHandler} 

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