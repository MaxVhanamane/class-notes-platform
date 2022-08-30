import connectDb from '../../middleware/mongoose';
import Syllabus from './../../models/syllabus';
export default async function handler(req, res) {
    connectDb()
    let syllabus = await Syllabus.find()

    res.status(200).json({ syllabus })
}
