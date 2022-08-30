import connectDb from '../../middleware/mongoose';
import Syllabus from './../../models/syllabus';
export default async function handler(req, res) {
    connectDb()
    if (req.method === "POST") {
       
        for (let i = 0; i < req.body.length; i++) {
            let question = new Syllabus({
                subject: req.body[i].subject,
                part: req.body[i].part,
                chapterName: req.body[i].chapterName,
                classNm: req.body[i].classNm,
                question: req.body[i].question,
                answer: req.body[i].answer,
                image: req.body[i].image,
                importanceOfQuestion: req.body[i].importanceOfQuestion,
            })
            await question.save()
        }
        res.status(200).send({ success: "success" })
       
    }
    else {
        res.status(400).send({ error: "Not allowed" })
    }

}
