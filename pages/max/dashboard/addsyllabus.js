import React, { useState, useRef } from "react";
import Head from "next/head";
import DashboardSidebar from "../../../components/DashboardSidebar";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";
//firebase
import { storage } from "../../../components/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Addsyllabus() {
  const [syllabusDetails, setsyllabusDetails] = useState({
    subject: "",
    part: "",
    chapterName: "",
    classNm: "",
    question: "",
    answer: "",
    img: "",
  });

  // firebase
  const [uploading, setUploading] = useState(false);
  const uRef = useRef();
  const [imageInfo, setImageInfo] = useState({
    imageUpload: "",
    fileLocation: "",
  });

  const handleFirebaseFileLocation = (e) => {
    setImageInfo({
      ...imageInfo,
      fileLocation: e.target.value,
    });
  };

  // Getting the information of the file that user has selected
  let handleFileChange = (e) => {
    setImageInfo({ ...imageInfo, imageUpload: e.target.files[0] });
  };

  // Uploading image to firebase and getting back url of that image.
  let handleUpload = () => {
    // If no file is selected then we will do nothing.
    if (imageInfo.imageUpload == null) return;
    if (imageInfo.fileLocation === "syllabus") {
      const imageRef = ref(storage, `syllabus/${imageInfo.imageUpload.name}`);
      uploadImageToFirebase(imageRef);
    } else {
      toast.error("Please select file location to upload an image", {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    function uploadImageToFirebase(imageRef) {
      setUploading(true);
      uploadBytes(imageRef, imageInfo.imageUpload)
        .then((e) => {
          getDownloadURL(e.ref).then((url) => {
            //

            setsyllabusDetails({
              ...syllabusDetails,
              img: url,
            });

            setUploading(false);
            toast.success("Image uploaded successfully!", {
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          });
        })
        .catch((error) => {
          toast.error(error.message, {
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setUploading(false);
        });
      uRef.current.value = "";
      setImageInfo({
        ...imageInfo,
        fileLocation: "",
      });
    }
  };

  // handleChange

  const handleChange = (e) => {
    if (e.target.name === "subject") {
      setsyllabusDetails({
        ...syllabusDetails,
        subject: e.target.value,
      });
    } else if (e.target.name === "part") {
      setsyllabusDetails({
        ...syllabusDetails,
        part: e.target.value,
      });
    } else if (e.target.name === "classNm") {
      setsyllabusDetails({
        ...syllabusDetails,
        classNm: e.target.value,
      });
    } else if (e.target.name === "chapterName") {
      setsyllabusDetails({
        ...syllabusDetails,
        chapterName: e.target.value,
      });
    } else if (e.target.name === "question") {
      setsyllabusDetails({
        ...syllabusDetails,
        question: e.target.value,
      });
    } else if (e.target.name === "answer") {
      setsyllabusDetails({
        ...syllabusDetails,
        answer: e.target.value,
      });
    } else if (e.target.name === "img") {
      setsyllabusDetails({
        ...syllabusDetails,
        img: e.target.value,
      });
    }
  };

  const handleAdd = async () => {
    const data = [
      {
        subject: syllabusDetails.subject,
        part: syllabusDetails.part,
        classNm: syllabusDetails.classNm,
        chapterName: syllabusDetails.chapterName,
        question: syllabusDetails.question,
        answer: syllabusDetails.answer,
        img: syllabusDetails.img,
      },
    ];

    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/addsyllabus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = await res.json();
    if (response.success) {
      toast.success("Syllabus added successfully!", {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setsyllabusDetails({
        ...syllabusDetails,
        subject: "",
        part: "",
        chapterName: "",
        classNm: "",
        question: "",
        answer: "",
        img: "",
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
        <title>Dashboard - Add syllabus</title>
        <meta name="description" content="Add the syllabus" />
      </Head>
      <>
        <DashboardSidebar />

        <div className="lg:ml-60 sticky top-0 bg-violet-900 z-10">
          <div className="  p-2 font-bold md:text-3xl text-2xl  mx-auto text-center shadow  text-gray-50 bg-violet-900 drop-shadow mb-8 ">
            <h1 className="text-center mx-auto">Add syllabus</h1>
          </div>
        </div>
        <div className="lg:ml-28 p-6  pt-6 flex justify-center w-full">
          <div className="block p-6 rounded-lg shadow-lg bg-white w-[50rem]  mb-28">
            <h1 className="text-center md:text-xl text-lg mb-3 text-gray-700 font-semibold">
              Chapter details
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
                value={syllabusDetails.subject}
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
                htmlFor="part"
                className=" inline-block mb-2 text-gray-700"
              >
                * Part (part 1 , part 2 or grammer)
              </label>
              <input
                onChange={handleChange}
                value={syllabusDetails.part}
                name="part"
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
                id="part"
                placeholder="Enter the part name"
              />
            </div>

            <div className="form-group mb-6">
              <label
                htmlFor="chapterName"
                className=" inline-block mb-2 text-gray-700"
              >
                * Chapter Name
              </label>
              <input
                onWheel={(event) => event.currentTarget.blur()}
                onChange={handleChange}
                value={syllabusDetails.chapterName}
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
                * Class Name
              </label>
              <input
                onWheel={(event) => event.currentTarget.blur()}
                onChange={handleChange}
                value={syllabusDetails.classNm}
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
                * Question
              </label>
              <input
                onChange={handleChange}
                value={syllabusDetails.question}
                name="question"
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
                id="question"
                placeholder="Enter the question"
              />
            </div>

            <div className="form-group mb-6">
              <label
                htmlFor="part"
                className=" inline-block mb-2 text-gray-700"
              >
                * Answer
              </label>
              <textarea
                onChange={handleChange}
                value={syllabusDetails.answer}
                name="answer"
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
                id="answer"
                placeholder="Enter the answer"
              />
            </div>

            {/* Upload image to firebase  */}

            <div className="mb-6 flex ">
              <div className="form-group mb-2  ">
                <p className="formLabel inline-block mb-4  text-gray-700">
                  Upload Image
                </p>

                <div className="relative w-full  mb-12">
                  <label
                    htmlFor="filelocation"
                    className="formLabel inline-block mb-2 text-gray-700"
                  >
                    Select the name of the directory where you want to store the
                    image in firebase
                  </label>

                  <select
                    name="filelocation"
                    id="filelocation"
                    className="w-full p-2.5  text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
                    onChange={handleFirebaseFileLocation}
                    value={
                      imageInfo.fileLocation
                        ? imageInfo.fileLocation
                        : "selectfilelocation"
                    }
                  >
                    <option value={"selectfilelocation"} disabled>
                      Select File Location
                    </option>
                    <option>syllabus</option>
                  </select>
                </div>
                <p
                  className={`hover:text-gray-700 mb-3  ${
                    uploading === false
                      ? "hidden"
                      : "text-blue-700 animate-pulse"
                  } `}
                >
                  {" "}
                  Uploading please wait...
                </p>
                <input
                  ref={uRef}
                  onChange={handleFileChange}
                  name="file"
                  type="file"
                  className="form-control
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
                  id="file"
                />

                <button
                  onClick={handleUpload}
                  type="submit"
                  className="
mt-8
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
                  Upload
                </button>
              </div>
            </div>

            <div className="form-group mb-6">
              <label
                htmlFor="image"
                className="formLabel inline-block mb-2 text-gray-700"
              >
                Image (will automatically select once you upload an image)
              </label>
              <input
                readOnly
                name="img"
                value={syllabusDetails.img}
                type="text"
                className="form-control
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
                id="image"
                aria-describedby="emailHelp"
                placeholder="Enter image path"
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
