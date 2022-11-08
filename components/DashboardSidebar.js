import React, { useContext, useRef } from "react";
import Link from "next/link";
import { IoIosAddCircle } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { RiCloseCircleFill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillHome } from "react-icons/ai";
import { useRouter } from "next/router";
import {  signOut } from "next-auth/react"

export default function DashboardSidebar() {
  const router = useRouter();
  const currentPath = router.pathname;

  const dashBoardToggler = useRef();
  const toggleSidebar = () => {
    if (dashBoardToggler.current.classList.contains("-translate-x-full")) {
      dashBoardToggler.current.classList.remove("-translate-x-full");
      dashBoardToggler.current.classList.add("-translate-x-0");
    } else if (
      !dashBoardToggler.current.classList.contains("-translate-x-full")
    ) {
      dashBoardToggler.current.classList.remove("-translate-x-0");
      dashBoardToggler.current.classList.add("-translate-x-full");
    }
  };
  return (
    <>
      <div
        onClick={toggleSidebar}
        className="lg:hidden fixed top-[0.375rem] left-5 text-4xl text-gray-50 flex items-center justify-center  z-20"
      >
        <GiHamburgerMenu />
      </div>
      <aside
        ref={dashBoardToggler}
        className="overflow-y-scroll h-full  shadow-md rounded-sm  sidebar w-60 fixed top-0 left-0 bg-gray-100 z-20 transform transition-transform -translate-x-full lg:translate-x-0 duration-300 "
        aria-label="Sidebar"
      >
        <div className="overflow-y-auto py-4 px-3 h-full bg-gray-50  ">
          <div
            onClick={toggleSidebar}
            className="fixed right-4 top-4 text-xl text-gray-500 lg:hidden"
          >
            <RiCloseCircleFill />
          </div>
          <div className="flex-shrink-0 flex ">
            <span className="block w-auto line-height leading-8 text-white px-2 rounded-xl bg-violet-900 font-bold text-xl">
              Shejale Sir
            </span>
          </div>
          <ul className="space-y-2 mt-8">
            <Link href="/max/dashboard/addsyllabus">
              <li onClick={toggleSidebar}>
                <a
                  className={`cursor-pointer flex items-center p-2 ${
                    currentPath == "/max/dashboard/addsyllabus"
                      ? "text-violet-600"
                      : "text-gray-500"
                  }  text-base font-normal  rounded-lg  hover:bg-gray-100 transition ease-out  hover:-translate-y-1 hover:scale-105 duration-300 `}
                >
                  <IoIosAddCircle className="flex-shrink-0 w-6 h-6  transition duration-75   " />
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Add Syllabus
                  </span>
                </a>
              </li>
            </Link>

            <Link href="/max/dashboard/editsyllabus">
              <li onClick={toggleSidebar}>
                <a
                  className={`cursor-pointer flex items-center p-2 ${
                    currentPath == "/max/dashboard/editsyllabus"
                      ? "text-violet-600"
                      : "text-gray-500"
                  }  text-base font-normal  rounded-lg  hover:bg-gray-100 transition ease-out  hover:-translate-y-1 hover:scale-105 duration-300 `}
                >
                  <MdModeEdit className="flex-shrink-0 w-5 h-6  transition duration-75   " />
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Edit Syllabus
                  </span>
                </a>
              </li>
            </Link>

            <Link href="/">
              <li onClick={toggleSidebar}>
                <a className=" cursor-pointer flex items-center p-2 text-base font-normal text-gray-500 rounded-lg  hover:bg-gray-100 transition ease-out  hover:-translate-y-1 hover:scale-105 duration-300 ">
                  <AiFillHome className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75  \ " />
                  <span className="flex-1 ml-3 whitespace-nowrap">Home</span>
                </a>
              </li>
            </Link>
            <li
              onClick={() => {
                const con = confirm("Do you really want to logout?");
                if (con) {
                  signOut()
                }
              }}
            >
              <p className=" cursor-pointer flex items-center p-2 text-base font-normal text-red-500 rounded-lg  hover:bg-gray-100 transition ease-out  hover:-translate-y-1 hover:scale-105 duration-300">
                <RiLogoutCircleRLine className="flex-shrink-0 w-6 h-6 text-red-500 transition duration-75  " />
                <span className="flex-1 ml-3 whitespace-nowrap">Logout</span>
              </p>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
