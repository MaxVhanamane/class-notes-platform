import React,{useState} from 'react'
import {useRouter} from "next/router"
import Link from "next/link"
export default function Navbar() {
    const [toggle,setToggle]=useState(false)
    const router=useRouter()
    const currentPath=router.pathname
  
  return (
   <nav className="bg-gray-100 fixed z-20 top-0 w-full shadow-lg">
  <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
    <div className="relative flex items-center justify-between h-12">
      <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
        {/* <!-- Mobile menu button--> */}
        <button onClick={()=>{setToggle(!toggle)}} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
          <span className="sr-only">Open main menu</span>
          {/* <!--
            Icon when menu is closed.

            Heroicon name: outline/bars-3

            Menu open: "hidden", Menu closed: "block"
          --> */}
          <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          {/* <!--
            Icon when menu is open.

            Heroicon name: outline/x-mark

            Menu open: "block", Menu closed: "hidden"
          --> */}
          <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>


      
      <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
        <div className="flex-shrink-0 flex items-center">
          {/* <img className="block lg:hidden h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=500" alt="Workflow"/>
          <img className="hidden lg:block h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=500" alt="Workflow"/> */}
          <span className={`block h-8 w-auto text-white px-2 rounded-xl ${currentPath=="/scholarship" ?"bg-blue-700":"bg-purple-900"} font-bold text-xl`}>Shejale Sir </span>
        </div>
        <div className="hidden sm:block sm:ml-6">
          <div className="flex space-x-4">
            {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
          <Link href="/"><a className={`${currentPath=="/" ? "text-violet-600" : 'text-gray-500' }  px-3 py-2 rounded-md text-sm font-medium` }aria-current="page">Home</a></Link>
          <Link href="/about"><a className={`${currentPath=="/about" ? "text-violet-600" : 'text-gray-500'}  px-3 py-2 rounded-md text-sm font-medium` }aria-current="page">About me</a></Link>
      
          </div>
        </div>
      </div>
      
    </div>
  </div>

  {/* <!-- Mobile menu, show/hide based on menu state. --> */}
{  toggle && <div className="sm:hidden" id="mobile-menu">
    <div className="px-2 pt-2 pb-3 space-y-1 flex flex-col">
      {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
      <Link href="/"><a  onClick={()=>{
        setToggle(!toggle)
      }}  className={`${currentPath==="/" ? "text-violet-600" : 'text-gray-500'}  px-3 py-2 rounded-md text-sm font-medium` }>Home</a></Link>

<Link href="/about"><a  onClick={()=>{
        setToggle(!toggle)
      }} className={`${currentPath==="/about" ? "text-violet-600" : 'text-gray-500'}  px-3 py-2 rounded-md text-sm font-medium` }>About me</a></Link>
    </div>
  </div>}
</nav>
  )
}
