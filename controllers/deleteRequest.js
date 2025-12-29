import Request from "../models/Request.models.js";

export const deleteRequest=async (req,res)=>{
 try {
    const requestId = req.params.id;
    const userId = req.user.id;


    const request = await Request.findById(requestId);
    if(!request){
        return res.status(400).json({message:"request not found"});
    }

    //only requester can  delete the request
    if(request.requesterId.toString() !== userId){
        return res.status(403).json({message:"not authorized"});
    }

    await Request.findByIdAndDelete(requestId);
    return res.status(200).json({message:"Request deleted successfully"});
 } catch (error) {
    console.error(error);
    res.status(500).json({message:"server error"});
 }
};

