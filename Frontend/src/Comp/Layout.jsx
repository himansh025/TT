import React from 'react'
import { Outlet } from 'react-router'
import Sidebar from './Sidebar'

function Layout() {
  return (
    <>
    <div className='flex h-screen w-full '>
      <div className=" md:w-64 z-10 fixed bg-gray-950 h-full">
    <Sidebar />
  </div>
      <div className="flex-1 h-auto  overflow-auto  mt-16 md:mt-0 md:ml-64  ">
        <Outlet />
      </div>
    </div>
      </>
  )
}

export default Layout

