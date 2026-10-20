import connectDb from '../../middleware/mongoose';
import Syllabus from '../../models/syllabus';
export default async function handler(req, res) {
    connectDb()
    if (req.method === "POST") {
          try{
            let finalRes=await Syllabus.findByIdAndUpdate(req.body._id, req.body)
            return res.status(200).send({ success: true })
          }
          catch(error){
            return res.status(200).send({ success: false,error:error })

          }
            
    }
    else {
        res.status(400).send({success:false, error: "Not allowed" })
    }

}
