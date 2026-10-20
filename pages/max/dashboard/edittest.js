import Head from "next/head";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

// Dashboard sidebar component
import DashboardSidebar from "../../../components/DashboardSidebar";

// next auth imports
import { getSession } from "next-auth/react";




export default function EditSyllabus() {
  const [data, setData] = useState([]);
  const [serverSideData, setserverSideData] = useState([]);
  const [showModal, setShowModal] = useState(false);
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
  const [testDetails, setTestDetails] = useState({
    _id:"",
    subject: "",
    chapterName: "",
    classNm: "",
    url:""
  });


// To get all available class names and subject names.
  let getData = async () => {
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/gettests`);
    let finalres = await res.json();
    setserverSideData(() => finalres.test);
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
        if (val.subject.toLowerCase().includes(searchTerm.toLowerCase())) {
          return val;
        }
        // you have to add else statement else it will give warning in console that filter is not returning anything.
        else {
          return null;
        }
      });
      setData(filterData);
      // If I am using search box for getting the data, I will set the  selectSubject value to it's default values(i.e I will unselect the selected options)
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
   console.log("ye wala",selectSubject)
    let data = { subject:selectSubject };
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/gettests`,
      {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    let foundTests = await response.json();
    console.log(foundTests.test.length)
    setData(() => foundTests.test);
    // To show proper message if no data found
    setSearchButtonClicked(true)
    setSearchTerm(()=>"")
    // If I delete all the available data in a particular selected subject. then select tag will automatically selects the first available subject but that doesn't 
    // changes the state value of  setSelectSubject because of that  we won't be able to search with that auto selected value (we will have to refresh the page or use the search bar for the searching, to avoid this we will reset the selectsubject state )
   if(foundTests.test.length==0){
    setSelectSubject(()=>"default")
    setSearchButtonClicked(false)
   }
    // If admin edits the subject name then to get new name we will call getData

    getData();
    
  };

  // to handle delete button
  const handleDeleteTest = async (item) => {
    let data = item;
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/deletetest`,
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
      toast.success("Test deleted successfully!", {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    // To get the latest data after deleting
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

  // To handle Editing
  const handleEdit = async () => {
    const data = {
        _id:testDetails._id,
        subject: testDetails.subject,
        classNm: testDetails.classNm,
        chapterName: testDetails.chapterName,
        url: testDetails.url,
       
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/edittest`,
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
      toast.success("Test details updated successfully!", {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      handleSelectBasedSearch();
      // While editing If I change the subject name and save it. Then When I close the edit modal then 
      // Select based search will automatically select the latest value  (If you don't add following line then It will still show you the latest value because you called handleSelectBasedSearch. but you won't be able to search with that value)
      // If I don't add the following line then I will have to refresh the page or use search bar to search the content because the state of 
      // selectSubject is still the old one. 
      setSelectSubject(()=>testDetails.subject)
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
          <title>Shejale Sir- Edit test</title>
          <meta name="description" content="Edit syllabus" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <DashboardSidebar />

        <div className="lg:ml-60 sticky top-0 bg-violet-900 z-10">
          <div className="  p-2 font-bold md:text-3xl text-2xl  mx-auto text-center shadow  text-gray-50 bg-violet-900 drop-shadow mb-8 ">
            <h1 className="text-center mx-auto">Edit test</h1>
          </div>
        </div>

        <main className=" flex items-center  flex-col lg:ml-60 sticky top-0 h-screen">
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
                  value={selectSubject}
                  defaultValue={"default"}
                  onChange={(e) => setSelectSubject(()=>e.target.value)}
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
                      Class Name
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-1 md:px-2 text-center whitespace-nowrap "
                    >
                      Url
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
                            {item.classNm}
                          </td>

                          <td className="py-4 px-1 md:px-2 text-center whitespace-nowrap">
                            {item.url}
                          </td>
                         
                     

                          <td className="py-4 px-2 md:px-2 text-center whitespace-nowrap">
                            <div className="flex space-x-2 items-center justify-center">
                              <button
                                onClick={(e) => {
                                
                                  setTestDetails((prev) => {
                                    return {
                                      ...prev,
                                      _id:item._id,
                                      subject: item.subject,
                                      chapterName: item.chapterName,
                                      classNm: item.classNm,
                                      url: item.url,
                                    
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
                                    handleDeleteTest(item);
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
  
              {( selectSubject!="default"&& searchButtonClicked) || (searchTerm.length>0  )? (
                <p>No records found!</p>
              ) : (
                <p className="text-center">
                  For syllabus details, select the subject name or use the search
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
              <h2 className="mb-2 text-gray-100">Edit the test details</h2>
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
              <input
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
