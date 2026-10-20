import connectDb from '../../middleware/mongoose';
import Test from '../../models/test';
export default async function handler(req, res) {
    connectDb()
    if (req.method === "POST") {
       try{
        for (let i = 0; i < req.body.length; i++) {
            let test = new Test({
                subject: req.body[i].subject,
                chapterName: req.body[i].chapterName,
                classNm: req.body[i].classNm,
                url: req.body[i].url,
  
            })
            await test.save()
        }
        res.status(200).send({ success: true })
       }
       catch(error){
        if (error.name === "ValidationError") {
            let errors = {};
      
            Object.keys(error.errors).forEach((key) => {
              errors[key] = error.errors[key].message;
            });
      
            return res.status(400).json({ success: false,error:errors });
          }
    }
    
       
    }
    else {
        res.status(400).send({ error: "Not allowed",success:false })
    }

}
