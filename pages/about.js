import React from 'react'
import Head from "next/head"
export default function about() {
  return (
    <>
    <Head>
      <title>About me </title>
      <meta name="description" content='This page shows all the information about me.'></meta>
    </Head>
    <div className='container mx-auto pt-24 lg:w-1/2 px-6 flex items-center justify-center flex-col text-justify '>
      <h1 className='font-bold text-purple-900 text-2xl '>About me</h1>
      <p className='text-lg mt-6'> Hello,
        I am Suraj! I am from Solapur, India. I was born and raised there and I have been teaching secondary school   
         <span className="font-bold"> Science</span> for two years now.
        I have a genuine passion for my subject, which I believe really shows in my teaching. I love to pass on my knowledge to younger generations in a fun and creative way.</p>
    </div>
    </>
  )
}
