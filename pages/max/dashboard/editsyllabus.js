import Head from "next/head";
import { useState, useEffect,useRef } from "react";
import { toast } from "react-toastify";

// Dashboard sidebar component
import DashboardSidebar from "../../../components/DashboardSidebar";

// next auth imports
import { getSession } from "next-auth/react";

//firebase imports
import { storage } from "../../../components/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


export default function EditSyllabus() {
  const [data, setData] = useState([]);
  const [serverSideData, setserverSideData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectClass, setSelectClass] = useState();
  const [selectSubject, setSelectSubject] = useState();
  const [searchTerm, setSearchTerm] = useState("");

// To show no records found message if we do select based search and don't find anything
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);

// getting all the available class names
  let classNms = serverSideData.map((cl) => {
    return cl.classNm;
  });
// when we get all available classess we will have have so many duplicate class names. by sorting we can solve that problem
  let uniqueclassNm = [...new Set(classNms)].sort(function (a, b) {
    return a - b;
  });

// getting all the available subjects
  let subjectNames = serverSideData.map((cl) => {
    return cl.subject;
  });
  // when we get all available subjects we will have have so many duplicate subject names. by sorting we can solve that problem
  let uniqueSubjectNames = [...new Set(subjectNames)].sort();



  // State to store data while editing
  const [syllabusDetails, setsyllabusDetails] = useState({
    _id:"",
    subject: "",
    part: "",
    chapterName: "",
    classNm: "",
    question: "",
    answer: "",
    img: "",
  });


// To get all available class names and subject names.
  let getData = async () => {
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getsyllabus`);
    let finalres = await res.json();
    setserverSideData(() => finalres.syllabus);
  };

// To get all the syllabus on first render
  useEffect(() => {
    getData();
  }, []);

// To get data according to search term

  useEffect(() => {
  // If there is nothing in search box we will set data to an empty array else we will filter using questions
    if (searchTerm === "") {
      setData([]);
    } else {
      const filterData = serverSideData.filter(function (val) {
        if (val.question.toLowerCase().includes(searchTerm.toLowerCase())) {
          return val;
        }
        // you have to add else statement else it will give warning in console that filter is not returning anything.
        else {
          return null;
        }
      });
      setData(filterData);
      // If I am using search box for getting the data, I will set the selectClass and selectSubject value to it's default values(i.e I will unselect the selected options)
      setSelectClass("default");
      setSelectSubject("default");
      // This is to show proper message If we use select options based search
      setSearchButtonClicked(false)

    }
  }, [searchTerm]);

  // To handle values typed in search box
  const handleSearch = (event) => {
    setSearchTerm(() => event.target.value);
  };

  // To handle select options based search
  const handleSelectBasedSearch = async () => {
   
    let data = { className: selectClass,subject:selectSubject };
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/getsyllabus`,
      {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    let foundSyllabus = await response.json();
    setData(() => foundSyllabus.syllabus);
    // To show proper message if no data found
    setSearchButtonClicked(true)
    setSearchTerm(()=>"")
    // getData();
  };

  // to handle delete button
  const handleDeleteChapter = async (item) => {
    let data = item;
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/deletesyllabus`,
      {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    let result = await response.json();
    if (result.success) {
      toast.success("Chapter deleted successfully!", {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      handleSelectBasedSearch();
    } else {
      toast.error("Chapter not found!", {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
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

  // To handle Editing
  const handleEdit = async () => {
    const data = {
        _id:syllabusDetails._id,
        subject: syllabusDetails.subject,
        part: syllabusDetails.part,
        classNm: syllabusDetails.classNm,
        chapterName: syllabusDetails.chapterName,
        question: syllabusDetails.question,
        answer: syllabusDetails.answer,
        image: syllabusDetails.img,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/editsyllabus`,
      {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const response = await res.json();
    if (response.success) {
      toast.success("Syllabus updated successfully!", {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      handleSelectBasedSearch();
    } else {
      toast.error("Some error occured, please try again later!", {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };


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
      <div>
      
        <Head>
          <title>Shejale Sir- Edit syllabus</title>
          <meta name="description" content="Edit syllabus" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <DashboardSidebar />

        <div className="lg:ml-60 sticky top-0 bg-violet-900 z-10">
          <div className="  p-2 font-bold md:text-3xl text-2xl  mx-auto text-center shadow  text-gray-50 bg-violet-900 drop-shadow mb-8 ">
            <h1 className="text-center mx-auto">Edit syllabus</h1>
          </div>
        </div>

        <main className=" flex items-center  flex-col lg:ml-60 sticky top-0 bg-[#f9fafb] h-screen">
          <div>
            <input
              type="text"
              placeholder="Enter the question "
              className="border-none ring-2 ring-gray-300 focus:ring-gray-500 focus:ring-2
       bg-white rounded-xl sm:p-6 sm:w-80 p-[0.5rem] lg:p-[0.5rem] w-64 sm:pl-[3rem] lg:pl-6 pl-4 md:p-[0.5rem]
       outline-none  shadow-neutral-300"
              onChange={handleSearch}
              value={searchTerm}
            />
          </div>

          <div className="flex flex-row gap-2 items-center justify-center px-1 mb-4">
            <div className="mt-6">
              {/* <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400 text-center">Select the Class</label> */}
              <div className="mt-2">
                <select
                  className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 "
                  value={selectClass}
                  defaultValue={"default"}
                  onChange={(e) => setSelectClass(e.target.value)}
                >
                  <option value={"default"} className="text-center" disabled>
                    Select the class
                  </option>
                  {uniqueclassNm.map((cls) => {
                    return (
                      <option key={cls} className="text-center" value={cls}>
                        {cls}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            
            <div className="mt-6">
              {/* <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400 text-center">Select the Class</label> */}
              <div className="mt-2">
                <select
                  className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 "
                  value={selectSubject}
                  defaultValue={"default"}
                  onChange={(e) => setSelectSubject(e.target.value)}
                >
                  <option value={"default"} className="text-center" disabled>
                    Select the subject
                  </option>
                  {uniqueSubjectNames.map((sub) => {
                    return (
                      <option key={sub} className="text-center" value={sub}>
                        {sub}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>



            <div className=" flex mt-6 gap-2 ">
              <button
                onClick={handleSelectBasedSearch}
                className="bg-violet-900 hover:bg-violet-800 outline-none p-1.5 rounded text-white mt-2"
              >
                Search
              </button>
            </div>
          </div>

          {data.length > 0 ? (
            <div className="overflow-x-auto overflow-y-auto relative  w-full mt-4 no-scrollbar px-2 mb-28">
              <table className="w-full text-sm text-left text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase border-b border-r-0 border-collapse bg-gray-50 sticky top-0">
                  <tr>
                    <th
                      scope="col"
                      className="py-3 px-2 md:px-2  text-center  whitespace-nowrap "
                    >
                      Sr No.
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-2 md:px-2  text-center  whitespace-nowrap"
                    >
                      Subject
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-1 md:px-2  text-center whitespace-nowrap"
                    >
                      Chapter Name
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-1 md:px-2  text-center whitespace-nowrap"
                    >
                      Part
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-1 md:px-2 text-center whitespace-nowrap "
                    >
                      Question
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-1 md:px-2 text-center whitespace-nowrap"
                    >
                      Answer
                    </th>
                    
                    <th
                      scope="col"
                      className="py-3 px-1 md:px-2 text-center whitespace-nowrap"
                    >
                      Image
                    </th>
                    

                    <th
                      scope="col"
                      className="py-3 px-1 md:px-2 text-center whitespace-nowrap"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    .map((item, index) => {
                      return (
                        <tr
                          key={index}
                          className="bg-white border-border-collapse   "
                        >
                          <td className="py-4 px-2 md:px-2 text-center  whitespace-nowrap">
                            {index + 1}
                          </td>

                          <td className="py-4 px-2 md:px-2 text-center whitespace-nowrap capitalize ">
                            {item.subject}
                          </td>

                          <td className="py-4 px-2 md:px-2 text-center whitespace-nowrap">
                            {item.chapterName}
                          </td>

                          <td className="py-4 px-1 md:px-2 text-center whitespace-nowrap">
                            {item.part}
                          </td>

                          <td className="py-4 px-1 md:px-2 text-center whitespace-nowrap">
                            {item.question}
                          </td>
                         

                          <td className="py-4 px-1 md:px-2 text-center ">
                            {item.answer.substr(0,50)}
                          </td>
                     
                          <td className="py-4 px-1 md:px-2 text-center ">
                            {item.image.substr(0,20)}
                          </td>
                     

                          <td className="py-4 px-2 md:px-2 text-center whitespace-nowrap">
                            <div className="flex space-x-2 items-center justify-center">
                              <button
                                onClick={(e) => {
                                
                                  setsyllabusDetails((prev) => {
                                    return {
                                      ...prev,
                                      _id:item._id,
                                      subject: item.subject,
                                      part:item.part,
                                      chapterName: item.chapterName,
                                      classNm: item.classNm,
                                      question: item.question,
                                      answer: item.answer,
                                      img: item.image,
                                    };
                                  });

                                  setShowModal(true);
                                }}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded py-0.5 px-1 outline-none md:px-2 md:py-1"
                              >
                                Edit
                              </button>

                              <button
                                onClick={(e) => {
                                  let confirmVal = confirm(
                                    "Do you really want to delete?"
                                  );
                                  if (confirmVal) {
                                    handleDeleteChapter(item);
                                  }
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white rounded py-0.5 px-1 outline-none  md:px-2 md:py-1"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex justify-center items-center font-semibold my-20 md:p-10 p-8 text-violet-900">
  
              {(selectClass!="default" && selectSubject!="default"&& searchButtonClicked) || (searchTerm.length>0  )? (
                <p>No records found!</p>
              ) : (
                <p className="text-center">
                  For syllabus details, select the class name and subject name or use the search
                  bar.
                </p>
              )}
            </div>
          )}
        </main>
      </div>
      {showModal && (
        <div className="lg:ml-60 bg-gray-100 h-fit absolute inset-0 flex items-center justify-center z-[120] ">
          <div className="bg-violet-900 mt-12  rounded-lg mb-10">
            {/* heading */}
            <div className="text-center font-bold text-xl mt-4 border-b border-solid border-slate-200">
              <h2 className="mb-2 text-gray-100">Edit the syllabus</h2>
            </div>
            {/* body */}
            <div>
              <div className="p-6  pt-6 flex justify-center w-full">
                <div className="block p-6 rounded-lg shadow-lg bg-white lg:w-[50rem] w-80 md:w-[40rem]  mb-12">
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
          resize-y
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


                </div>
              </div>
            </div>
            {/* footer */}

            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="bg-red-500 text-white hover:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => {
                  handleEdit();
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


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
