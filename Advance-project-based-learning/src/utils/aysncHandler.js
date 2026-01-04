/*here are two approaches first one is using promises and second one is using try catch*/
// first approach

const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((error)=>next(error))
    }
}
export { asyncHandler }

//second approach 
/* const asyncHandler=(fn)=>async (req,res,next)=>{
    try{
        await fn(req,res,next)
    } catch(error) {
        res.status(error.code||500).json({
            success:false,
            message:error.message
        }) 
    
    }
} */