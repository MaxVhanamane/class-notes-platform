import connectDb from "../../middleware/mongoose";
import Syllabus from "../../models/syllabus";

export default async function handler(req,res){
    connectDb()
    if(req.method==="POST"){
        let deleteChapter = await Syllabus.findOneAndDelete(req.body)
        if(deleteChapter){

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
