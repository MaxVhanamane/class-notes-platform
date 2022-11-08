import connectDb from '../../middleware/mongoose';
import Syllabus from './../../models/syllabus';
export default async function handler(req, res) {
    connectDb()
    if (req.method === "POST") {
       try{
        for (let i = 0; i < req.body.length; i++) {
            let question = new Syllabus({
                subject: req.body[i].subject,
                part: req.body[i].part,
                chapterName: req.body[i].chapterName,
                classNm: req.body[i].classNm,
                question: req.body[i].question,
                answer: req.body[i].answer,
                image: req.body[i].img,
                importanceOfQuestion: req.body[i].importanceOfQuestion,
            })
            await question.save()
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
