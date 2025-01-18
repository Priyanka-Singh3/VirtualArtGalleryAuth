import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import {toast} from 'react-toastify'
import axios from 'axios'

const Navbar = () => {
  const navigate = useNavigate();
  
  const {setIsLoggedIn, userData, backendUrl, setUserData} = useContext(AppContext)
  const {isLoggedIn} = useContext(AppContext);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp');
      if(data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true
      const {data} = await axios.post(backendUrl + '/api/auth/logout');
      data.success && setIsLoggedIn(false)
      data.success && setUserData(false)
      navigate('/')
      toast.success("Logged out")
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="w-full flex justify-between items-center sm:px-24 p-2 bg-[#656d4a]">
        {/* <img src={assets.logo_name} alt="" className='w-28 h-full sm:w-40' /> */}

        <div>
          <h3 onClick={() => navigate('/')} className='text-white left-5 sm:left-20 top-5 text-xl sm:text-2xl cursor-pointer'><span className=''>Virtual </span>Art Gallery</h3>
        </div>
        {userData ? 
        <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'>
          {userData.name[0].toUpperCase()}
          <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black pt-10'>
            <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
              {!userData.isAccountVerified && <li onClick={sendVerificationOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify Email</li>}
              
              <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'>Logout</li>
            </ul>
          </div>
        </div> : 
        <button onClick={() => navigate("/login")} className='flex items-center gap-2 border bg-[#c2c5aa] border-[#333d29] rounded-full px-4 py-2 hover:text-black hover:bg-[#a4ac86] transition-all'>Login <img src={assets.arrow_icon} className='w-3 h-full sm:w-5' /></button>}
        
    </div>
  )
}

export default Navbar