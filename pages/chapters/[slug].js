import React from 'react'
import { useRouter } from "next/router";
import connectDb from './../../middleware/mongoose';
import Syllabus from './../../models/syllabus';
import ReactHtmlParser from 'react-html-parser';
import Link  from 'next/link';
import  Image  from 'next/image';
export default function Chapters({allQuestions}) {
    const router = useRouter();
    const { slug } = router.query;
    const part = (router.query.part).replace(/['"]+/g, '').replace(/\s+/, "") ;

  return (
    <div className='container  mt-16  mb-32'>
      {allQuestions.map((question)=>{
        return <div className='container flex flex-col  w-screen mt-6 text-justify p-4' key={question._id}>
        <h1 className='font-bold text-2xl lg:text-3xl text-violet-700 pl-4'>{question.question}</h1>
        <hr></hr>
        {question.image && <div className='mt-6 z-10 p-4 lg:p-4 text-lg'><Image src={question.image} objectFit="cover" width="400" height={200}/></div>}
        <div className='mt-4 p-4 lg:p-4 text-lg'>{ ReactHtmlParser(question.answer) }</div>
        </div>
      })}
      {/* To go back to previous page use router.back() */}
     <div onClick={() => router.back()} className="flex justify-center items-center"><button  className=' bg-purple-900 w-32 hover:bg-purple-800  text-gray-100  p-1 text-sm rounded-md mt-4'> Back</button></div>
     <Link href="/" ><div className="flex justify-center items-center"><button  className=' bg-purple-900 w-32 hover:bg-purple-800  text-gray-100  p-1 text-sm rounded-md mt-4'> Home</button></div></Link>

    </div>
  )
}


// This gets called on every request
export async function getServerSideProps(context) {
  // Fetch data from external API
  connectDb()
  // .replace(/['"]+/g, '') to remove quotes "" from url parameter. if I don't do that then I won't be able to search in db with that string.
  let part = (context.query.part).replace(/['"]+/g, '');
  let questions = await Syllabus.find({chapterName:context.query.slug,part:part})
  // console.log(questions)
  
  return { props: { allQuestions:JSON.parse(JSON.stringify(questions)) } }
}
