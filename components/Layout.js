import React from 'react'
import Navbar from './../components/Navbar';
import Footer from './../components/Footer';
import Head from "next/head"
export default function Layout({children}) {
  return (
    <>
    <Head>
    <title>Shejale Sir</title>
    </Head>
    <div className='min-h-screen'>
 <Navbar/>
      {children}
      <Footer/>
    </div>
    </>
  )
}
