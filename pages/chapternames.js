import React from 'react'
import Link from "next/link"
import connectDb from './../middleware/mongoose';
import Syllabus from './../models/syllabus';
import { useRouter } from "next/router";

export default function Part1({allSyllabus}) {
    let chapters= allSyllabus.map((chapter)=>{return chapter.chapterName})
    let uniqueChapterNames = [...new Set(chapters)].sort()
    const router = useRouter();

  return (
    <div className='mt-20 flex flex-col items-center justify-center'>
      <h1 className='text-center text-purple-900 font-bold text-xl'> Name of the Chapters</h1>
      <ol className='mt-6 list-decimal flex flex-col gap-6'>
       {uniqueChapterNames.sort().map((chapter)=>{
        return <Link key={`${chapter}`} passHref href={`/chapters/${chapter}?part=${router.query.part}`}><li className='text-lg font-semibold hover:underline text-gray-700 cursor-pointer'>{chapter}</li></Link> 
       })}
      
      </ol>
     <Link href="/"><button className='bg-purple-900 w-32 text-gray-100 hover:bg-purple-800  p-1 text-sm rounded-md mt-8'> Back</button></Link>
    </div>
  )
}


export async function getServerSideProps(context) {
    // Fetch data from external API
    connectDb()
    let part = (context.query.part);
    let subject = (context.query.subject);
    let classNm = (context.query.classNm);
    
    let questions = await Syllabus.find({subject:subject,part:part,classNm:classNm})
    
    return { props: { allSyllabus:JSON.parse(JSON.stringify(questions)) } }
  }
  