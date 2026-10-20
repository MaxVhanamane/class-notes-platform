import React, { useState, useRef } from "react";
import Head from "next/head";
import DashboardSidebar from "../../../components/DashboardSidebar";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";


export default function Addsyllabus() {
  const [testDetails, setTestDetails] = useState({
    subject: "",
    chapterName: "",
    classNm: "",
     url:""
  });

  

  // handleChange

  const handleChange = (e) => {
    if (e.target.name === "subject") {
      setTestDetails({
        ...testDetails,
        subject: e.target.value,
      });
    }  else if (e.target.name === "classNm") {
      setTestDetails({
        ...testDetails,
        classNm: e.target.value,
      });
    } else if (e.target.name === "chapterName") {
      setTestDetails({
        ...testDetails,
        chapterName: e.target.value,
      });
    } else if (e.target.name === "url") {
      setTestDetails({
        ...testDetails,
        url: e.target.value,
      });
    }
  };

  const handleAdd = async () => {
    const data = [
      {
        subject: testDetails.subject,
        classNm: testDetails.classNm,
        chapterName: testDetails.chapterName,
     
        url: testDetails.url,
      },
    ];

    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/addtest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = await res.json();
    if (response.success) {
      toast.success("Test added successfully!", {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTestDetails({
        ...testDetails,
        subject: "",
        chapterName: "",
        classNm: "",
        url: "",
      });
    } else {
      toast.error(`Please add ` + JSON.stringify(Object.keys(response.error)), {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <style jsx global>{`
        #footer {
          display: none;
        }
        nav {
          display: none;
        }
      `}</style>
      <Head>
        <title>Dashboard - Add test</title>
        <meta name="description" content="Add the syllabus" />
      </Head>
      <>
        <DashboardSidebar />

        <div className="lg:ml-60 sticky top-0 bg-violet-900 z-10">
          <div className="  p-2 font-bold md:text-3xl text-2xl  mx-auto text-center shadow  text-gray-50 bg-violet-900 drop-shadow mb-8 ">
            <h1 className="text-center mx-auto">Add test</h1>
          </div>
        </div>
        <div className="lg:ml-28 p-6  pt-6 flex justify-center w-full">
          <div className="block p-6 rounded-lg shadow-lg bg-white w-[50rem]  mb-28">
            <h1 className="text-center md:text-xl text-lg mb-3 text-gray-700 font-semibold">
              Test details
            </h1>

            <div className="form-group mb-6">
              <label
                htmlFor="name"
                className=" inline-block mb-2 text-gray-700"
              >
                * Subject
              </label>
              <input
                onChange={handleChange}
                value={testDetails.subject}
                name="subject"
                type="text"
                className="
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                id="subject"
                placeholder="Enter the subject name"
              />
            </div>

            

            <div className="form-group mb-6">
              <label
                htmlFor="chapterName"
                className=" inline-block mb-2 text-gray-700"
              >
                 Chapter Name
              </label>
              <input
                onWheel={(event) => event.currentTarget.blur()}
                onChange={handleChange}
                value={testDetails.chapterName}
                name="chapterName"
                type="text"
                className="
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                id="chapterName"
                placeholder="Enter the chapter name"
              />
            </div>

            <div className="form-group mb-6">
              <label
                htmlFor="classNm"
                className=" inline-block mb-2 text-gray-700"
              >
                 Class Name
              </label>
              <input
                onWheel={(event) => event.currentTarget.blur()}
                onChange={handleChange}
                value={testDetails.classNm}
                name="classNm"
                type="number"
                className="
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                id="classNm"
                placeholder="Enter a class name"
              />
            </div>

            

            <div className="form-group mb-6">
              <label
                htmlFor="part"
                className=" inline-block mb-2 text-gray-700"
              >
                * Url
              </label>
              <textarea
                onChange={handleChange}
                value={testDetails.url}
                name="url"
                type="text"
                className="
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                id="url"
                placeholder="Enter the url"
              />
            </div>

            

            

            <button
              onClick={handleAdd}
              type="submit"
              className="
      outline-none
        px-6
        py-2.5
        bg-violet-900
        text-white
        font-medium
        text-xs
        leading-tight
        uppercase
        rounded
        shadow-md
        hover:bg-violet-800 hover:shadow-lg
        focus:bg-violet-700 focus:shadow-lg focus:outline-none focus:ring-0
        active:bg-violet-800 active:shadow-lg
        transition
        duration-150
        ease-in-out"
            >
              Add
            </button>

            <p className="mt-3 text-sm md:text-right text-gray-500">
              * indicates a required field
            </p>
          </div>
        </div>
      </>
    </>
  );
}

// onWheel={ event => event.currentTarget.blur() } To stop increasing or decreasing the number as you scroll the mouse wheel through the input field. where type="number".
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  let admins = process.env.ADMINS.split(" ");
  if (!session || !admins.includes(session?.user?.email)) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}
