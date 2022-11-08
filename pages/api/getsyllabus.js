import connectDb from '../../middleware/mongoose';
import Syllabus from './../../models/syllabus';


export default async function handler(req, res) {
    connectDb()
   if(req.method==="POST")
   {
    let syllabus = await Syllabus.find({classNm:req.body.className,subject:req.body.subject})

    res.status(200).json({ syllabus })
   }
   else if (req.method==="GET"){
 
        let syllabus = await Syllabus.find({})

        res.status(200).json({ syllabus })
    

   }
   else{
    res.status(405).json({"error":"NOT Allowed"})
   }
       
    
   
  
}
