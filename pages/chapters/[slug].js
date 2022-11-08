import React from 'react'
import { useRouter } from "next/router";
import connectDb from './../../middleware/mongoose';
import Syllabus from './../../models/syllabus';
//ReactHtmlParser- To convert html code that is coming as string from backend to proper renderable html.
import ReactHtmlParser from 'react-html-parser';
import Link  from 'next/link';
import  Image  from 'next/image';
import Head from "next/head"

export default function Chapters({allQuestions}) {
    const router = useRouter();
    const myLoader = ({ src, width, quality }) => {
      return `${src}?w=${width}&q=${quality || 100}`;
    };
    const { slug } = router.query;

 const title = ` ${slug} `;

    // const part = (router.query.part).replace(/['"]+/g, '').replace(/\s+/, "") ;

  return (
    <>
    <Head>
      <title>{title}</title>
<meta name="description" content={allQuestions.map((question)=>{
  return question.question
})}/>

    </Head>
    <div className='md:px-8  mt-16  mb-32  break-words lg:w-9/12 lg:mx-auto'>
      {allQuestions.map((question)=>{
        return <div className=' flex flex-col   mt-6 text-justify p-4' key={question._id}>
        <h1 className='font-bold text-2xl lg:text-3xl text-violet-700 pl-4'>{question.question}</h1>
        <hr></hr>
        {question.image && <div className='mt-6 z-10 p-4 lg:p-4 text-lg'><Image  loader={myLoader}
                  alt="image" src={question.image} objectFit="cover" width={300} height={300}/></div>}
        <div className='mt-4 p-4 lg:p-4 text-lg'>{ ReactHtmlParser(question.answer) }</div>
        </div>
      })}
      {/* To go back to previous page use router.back() */}
      <div className='flex flex-row gap-4 justify-center items-center'>
     <div onClick={() => router.back()} className="flex justify-center items-center"><button  className='outline-none bg-purple-900 w-32 hover:bg-purple-800  text-gray-100  p-1 text-sm rounded-md mt-4'> Back</button></div>
     <div></div><Link href="/" ><div className="flex justify-center items-center"><button  className=' outline-none bg-purple-900 w-32 hover:bg-purple-800  text-gray-100  p-1 text-sm rounded-md mt-4'> Home</button></div></Link>
     </div>
    </div>
    </>
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
