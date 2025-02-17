import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios'

const Login = () => {

  const navigate = useNavigate();

  const {backendUrl, setIsLoggedIn, getUserData, isLoggedIn, userData} = useContext(AppContext)

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      //cookies bhi bhej ske taaki
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendUrl + '/api/auth/login', {email, password});
      if(data.success) {
        setIsLoggedIn(true)
        getUserData()
        navigate('/')
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
    
  }
  useEffect(() => {
      isLoggedIn && userData && userData.isAccountVerified && navigate('/')
    }, [isLoggedIn, userData])

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-[#656d4a] to-[#c2c5aa]'>
        <div>
          <h3 onClick={() => navigate("/")} className='absolute left-5 sm:left-20 top-5 text-2xl text-white cursor-pointer'><span className=''>Virtual </span>Art Gallary</h3>
        </div>
        <div className='bg-[#656d4a] p-10 rounded-lg shadow-lg w-full sm:w-96 text-gray-300 text-sm'>
          <h2 className='text-white text-3xl font-semibold text-center mb-3'>Login</h2>
          <p className=' text-sm text-center mb-3'>Login to your account !</p>


          <form onSubmit={onSubmitHandler}>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333d29]'>
            <img src={assets.mail_icon} className='w-3 h-full sm:w-5'/>
            <input type='email'
             placeholder='Email'
             required
             className='bg-transparent outline-none '
             onChange={(e) => setEmail(e.target.value)}
             value={email}
            />
          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333d29]'>
            <img src={assets.lock_icon} className='w-3 h-full sm:w-5'/>
            <input type='password'
             placeholder='Password'
             required
             className='bg-transparent outline-none '
             onChange={(e) => setPassword(e.target.value)}
             value={password}
            />
          </div>
          <p onClick={() => navigate('/reset-password')} className='mb-4 cursor-pointer rounded-full px-5 text-sm text-gray-300'>
            Forgot Password ?
          </p>
          <button className='w-full rounded-full py-2.5 bg-gradient-to-r from-[#a4ac86] to-[#333d29] text-white font-medium'>Login</button>
        </form>

       
        <p className='text-gray-400 text-center text-xs mt-4'>
          Don't have an Account?{'  '} 
          <span onClick={() => navigate('/register')} className='text-blue-400 cursor-pointer underline'> Sign up</span>
        </p>
        </div>
        

    </div>
  )
}

export default Login