import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import Head from "next/head";
import {FcGoogle} from "react-icons/fc"
import { useSession,getSession, signIn, signOut } from "next-auth/react"

export default function Login() {
 
  return (
    <>
      <Head>
        <title>ShejaleSir - Login</title>
        <meta name="description" content="ज्ञानपीठ login page" />
      </Head>
      <section className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-full bg-gray-200 ">
        <div className=" py-12 px-6 h-full">
          <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
            <div className="xl:w-6/12">
              <div className="block bg-white shadow-lg rounded-lg">
                <div className="flex justify-center items-center g-0">
                  <div className=" px-4 md:px-0">
                    <div className="md:p-12 md:mx-6">
                      <div className="text-center rounded-full">
                        <h4 className="text-2xl font-bold mt-1 mb-5 pb-1  text-gray-600">
                          Login 
                        </h4>
                      </div>
                     
                      <div className="text-center pt-1 mb-12 pb-1">
                          <button onClick={()=>{signIn('google',{callbackUrl:"http://localhost:3000/max/dashboard/addsyllabus"})}}
                            className="  px-6 py-2.5 flex gap-3 items-center justify-center font-medium text-xs leading-tight uppercase rounded shadow-md   active:shadow-lg transition duration-150 text-gray-800 ease-in-out w-full mb-3 bg-gray-100 hover:bg-gray-200"
                            data-mdb-ripple="true"
                            data-mdb-ripple-color="light"
                            type="submit"
                          >
                            <FcGoogle className="text-lg"/> <p>continue with google</p> 
                          </button>
                          </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
