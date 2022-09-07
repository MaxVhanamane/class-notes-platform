import React,{useState} from 'react'
import Link from "next/link"

export default function Select({allSyllabus}) {
  let classNm= allSyllabus.map((cl)=>{return cl.classNm})
  let uniqueclassNm = [...new Set(classNm)].sort(function (a, b) {  return a - b;  });


  let subject= allSyllabus.map((sub)=>{return sub.subject})
  let uniquesubjectName= [...new Set(subject)]

  let part= allSyllabus.map((part)=>{return part.part})
  let uniquepartName= [...new Set(part)].sort()
 
  const [selectClass, setSelectClass] = useState();
  const [subjectName, setSubjectName] = useState();
  const [partName, setPartName] = useState();
   

  return (
    <div className='flex flex-col items-center justify-center'>
     



  <div  className='mt-6'> 
<label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400 text-center">Select the Class</label>
<div className='mt-2'>
<select className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  value={selectClass}
  defaultValue={"default"}
  onChange={(e) => setSelectClass(e.target.value) }
>
  <option value={"default"} disabled>
    Select the class

  </option>
  {uniqueclassNm.map((cls)=>{return <option key={cls} className="text-center" value={cls}>{cls}</option> })}

</select>
</div>

</div>

  <div  className='mt-8'> 
<label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400 text-center">Select the Subject</label>
<div className='mt-2'>
<select className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  value={subjectName}
  defaultValue={"default"}
  onChange={(e) => setSubjectName(e.target.value)}
>
  <option value={"default"} disabled>
    Select the subject

  </option>
  {uniquesubjectName.map((sub)=>{return <option key={sub} className="text-center" value={sub}>{sub}</option> })}

</select>
</div>

</div>


  <div  className='mt-8'> 
<label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400 text-center">Select the Part</label>
<div className='mt-2'>
<select className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  value={partName}
  defaultValue={"default"}
  onChange={(e) => setPartName(e.target.value)}
>
  <option value={"default"} disabled>
    Select the part

  </option>

  {uniquepartName.map((part)=>{return <option key={part} className="text-center" value={part}>{part}</option> })}

  
</select>
</div>

</div>

<Link href={`/chapternames?classNm=${selectClass}&subject=${subjectName}&part=${partName}`}><button disabled={partName==undefined ||subjectName==undefined || selectClass==undefined} className='bg-purple-900 w-32 text-gray-100 hover:bg-purple-800 disabled:bg-gray-500  p-1 text-sm rounded-md mt-8'> Get Chapters</button></Link>
<p className="mt-2 text-gray-500 text-sm px-4 text-center">* Select all the above options to enable Get Chapters button.</p>

      
    </div>
  )
}




