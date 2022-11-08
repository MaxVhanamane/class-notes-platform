import React from 'react'

export default function Footer() {
  return (
    <footer className="sticky w-full bg-gray-100  flex items-center justify-center text-center text-white top-full" id="footer" >
 

    <div className="text-center text-gray-700 p-4 font-semibold" >
      © {new Date().getFullYear()}, ShejaleSir. All rights reserved.

      
    </div>
  </footer>
  )
}

