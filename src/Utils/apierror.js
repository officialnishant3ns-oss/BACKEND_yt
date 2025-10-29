class apierror extends Error{
   constructor(
    statuscode,
    message="something went wrong",
    error=[],
    stack="",
   ){
    super(message)
    this.statuscode=statuscode
    this.data =null 
    this.message=message
    this.success=false ;
    this.error=error
   }
}

   //  if(stack){      // may write same as like that there >>.>> some info learn about  that
   //      this.stack=stack
   //  }else{
   //     error.capturestacktrace(this ,this.constructor)
   //  }
   // }
// }
export{apierror}