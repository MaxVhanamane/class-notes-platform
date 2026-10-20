import connectDb from '../../middleware/mongoose';
import Test from './../../models/test';


export default async function handler(req, res) {
    connectDb()
   if(req.method==="POST")
   {
    let test = await Test.find({subject:req.body.subject})

    res.status(200).json({ test })
   }
   else if (req.method==="GET"){
 
        let test = await Test.find({})

        res.status(200).json({ test })
    

   }
   else{
    res.status(405).json({"error":"NOT Allowed"})
   }
       
    
   
  
}
