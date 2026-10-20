import mongoose from 'mongoose';

const TestSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    chapterName: { type: String, },
    classNm: { type: Number,required:true },
    url:{type:String, required: true}

}, { timestamps: true });
const Test = mongoose.models.Test || mongoose.model("Test", TestSchema)

export default Test
