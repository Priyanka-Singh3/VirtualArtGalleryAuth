import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex justify-between items-center sm:px-24 p-2 bg-[#656d4a]">
        {/* <img src={assets.logo_name} alt="" className='w-28 h-full sm:w-40' /> */}
        <div>
          <h3 className='text-white left-5 sm:left-20 top-5 text-xl sm:text-2xl'><span className=''>Virtual </span>Art Gallary</h3>
        </div>
        <button onClick={() => navigate("/login")} className='flex items-center gap-2 border bg-[#c2c5aa] border-[#333d29] rounded-full px-4 py-2 hover:text-black hover:bg-[#a4ac86] transition-all'>Login <img src={assets.arrow_icon} className='w-3 h-full sm:w-5' /></button>
    </div>
  )
}

export default Navbar