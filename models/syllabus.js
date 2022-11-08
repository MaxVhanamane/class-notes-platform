import mongoose from 'mongoose';

const SyllabusSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    part: { type: String, required: true },
    chapterName: { type: String, required: true },
    classNm: { type: Number, required: true },
    question: { type: String, required: true , unique: true},
    answer: { type: String, required: true },
    image: { type: String,default:"" }
}, { timestamps: true });
const Syllabus = mongoose.models.Syllabus || mongoose.model("Syllabus", SyllabusSchema)

export default Syllabus
