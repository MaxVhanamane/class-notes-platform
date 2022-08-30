import React from 'react'
import connectDb from './../middleware/mongoose';
import Syllabus from './../models/syllabus';
export default function notes() {
  return (
    <div>notes</div>
  )
}


// This gets called on every request
export async function getServerSideProps(context) {
    // Fetch data from external API
    connectDb()
    // .replace(/['"]+/g, '') to remove quotes "" from url parameter. if I don't do that then I won't be able to search in db with that string.
    // let part = (context.query.part).replace(/['"]+/g, '');
    let part = (context.query.part);
    let subject = (context.query.subject);
    let classNm = (context.query.classNm);
    
    let questions = await Syllabus.find({chapterName:context.query.slug,part:part})
    // console.log(questions)
    
    return { props: { allQuestions:JSON.parse(JSON.stringify(questions)) } }
  }
