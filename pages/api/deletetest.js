import connectDb from "../../middleware/mongoose";
import Test from "../../models/test";

export default async function handler(req,res){
    connectDb()
    if(req.method==="POST"){
        let deleteTest = await Test.findOneAndDelete(req.body)
        if(deleteTest){

            res.status(200).json({ success: true })
        }
        else{
            res.status(200).json({ success: false })
        }
    }
    else{
        res.status(405).json({success:false,"error":"Not Allowed"})
    }
}
