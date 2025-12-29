import Donor from "../models/Donor.models.js"


export const getNearbyDonors = async (req,res)=>{
    try {
        const {lat,lng,distance}=req.query;

        if(!lat || !lng){
            return res.status(500).json({message:"lat and lng required"});
        }
        const maxDistance = distance ? Number(distance) : 10000;  //default
        const donors = await Donor.aggregate([
            {
                $geoNear:{
                    near:{ type:"Point", coordinates: [Number(lng),Number(lat)] },
                    distanceField:"distance",
                    maxDistance:maxDistance,
                    spherical:true,
                }
            }
        ]);
        res.json(donors);
    } catch (error) {
        console.error("nearby donor error",error);
        res.status(500).json({message:"server error"});
    }
}
