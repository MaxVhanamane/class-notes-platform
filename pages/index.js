import Head from 'next/head'
import Image from 'next/image'
import { useEffect,useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import connectDb from './../middleware/mongoose';
import Syllabus from './../models/syllabus';
import Select from '../components/Select'
export default function Home({allSyllabus}) {
  const [searchResult,setSearchResult]=useState([])
  const[searchTerm,setSearchTerm]=useState("")
  const[showSearch,setshowSearch]=useState(false)
  useEffect(() => {
    if (searchTerm === "") {
      setSearchResult([])
    setshowSearch(false)

    }

    else {

      const filterData = allSyllabus.filter(function (val) {
        if (val.question.toLowerCase().includes(searchTerm.toLowerCase()) ) {
          return val
        }
        // you have to add else statement else it will give warning in console that filter is not returning anything.
        else {
          return null
        }
      })
      setSearchResult(filterData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  function handleSearch(event) {
    setSearchTerm(event.target.value)
    setshowSearch(true)
  }
  return (
<div className='lg:mb-28 mb-44'>
<div className='mx-auto mt-12 flex flex-col items-center justify-center'>
<h1 className=' mb-4 bg-purple-800 w-full text-white text-lg text-center py-1'>Notes For MSB Classes 5 - 10 </h1>

  <h1 className='mt-2 mb-4 text-purple-500 text-lg text-center'>Enter your question here </h1>
<input type="text" placeholder="Enter your question " className="border-none ring-2 ring-gray-300 focus:ring-gray-500 focus:ring-2
   bg-white rounded-xl sm:p-6 sm:w-96 p-[0.5rem] lg:p-[0.5rem] w-64 sm:pl-[3rem] lg:pl-6 pl-4
   outline-none  shadow-neutral-300" onChange={handleSearch} />
</div>
{!showSearch && <div>

<h1 className='text-center text-purple-900 font-bold text-2xl mt-10'> For chapterwise questions please select the following options.</h1>
</div>}
{showSearch &&  <div className='container  mt-2  mb-6'>
{searchResult.length>0 &&<h1 className="font-bold sm:text-2xl text-xl mt-6 text-center text-purple-500">Search Results</h1>}
{searchResult.length===0&& <h1 className="text-center font-bold sm:text-2xl text-xl mt-4 text-red-500">Sorry! No results found.</h1>}
     
      {searchResult.map((question)=>{
        return <div className='container flex flex-col  w-screen mt-6 text-justify p-4' key={question._id}>
        <h1 className='pl-4 font-bold text-2xl lg:text-3xl text-violet-700'>{question.question}</h1>
        <hr></hr>
        <div className='mt-4 p-4 lg:p-4 text-lg'>{ ReactHtmlParser(question.answer) }</div>
        </div>
      })}
    </div>}

{!showSearch && <Select allSyllabus={allSyllabus}/>}
</div>
    
  )
}

// This gets called on every request
export async function getServerSideProps(context) {
  // Fetch data from external API
  connectDb()
  let questions = await Syllabus.find({})
  return { props: { allSyllabus:JSON.parse(JSON.stringify(questions)) } }
}
