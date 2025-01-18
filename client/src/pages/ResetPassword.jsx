import React, { useState, useRef, useContext  } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {

  const {backendUrl} = useContext(AppContext)
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState(0)
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

  const inputRefs = React.useRef([])
  
  const handleInput = (e, index) => {
    if(e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }
  const handleKeyDown = (e, index) => {
    if(e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if(inputRefs.current[index]) {
        inputRefs.current[index].value = char ;
      }
    });
  }

  const onSumitEmail = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl + "/api/auth/send-reset-otp", {email});
      if(data.success) {
        toast.success(data.message);
      }
      else {
        toast.error(data.message);
      }
      data.success && setIsEmailSent(true)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value)
    setOtp(otpArray.join(''))
    setIsOtpSubmitted(true)
  }

  const onSubmitNewPasword = async (e) => {
    e.preventDefault();
    try {
      const {data} = axios.post(backendUrl + "/api/auth/reset-password", {email, otp, newPassword});
      if(data.success) {
        toast.success(data.message);
      }
      else {
        toast.error(data.message);
      }
      data.success && navigate('/login')
      
    } catch (error) {
      toast.error(error.message);
    }
  }


  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-[#656d4a] to-[#c2c5aa]'>
       <div>
          <h3 onClick={() => navigate("/")} className='absolute left-5 sm:left-20 top-5 text-2xl text-white cursor-pointer'><span className=''>Virtual </span>Art Gallary</h3>
        </div>

        {!isEmailSent && 
        <form onSubmit={onSumitEmail} className='bg-[#656d4a] p-8 rounded-lg shadow-lg w-96 text-gray-300 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
        <p className='text-center mb-6 text-gray-300'>Enter your registered email address.</p>
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333d29]'>
          <img src={assets.mail_icon} className='w-3 h-full sm:w-5'/>
          <input type="email"
          required
          placeholder='Email id'
          className='bg-transparent outline-none text-white'
          value={email}
          onChange={e => setEmail(e.target.value)}
          />
        </div>
        <button className='w-full rounded-full py-2.5 mt-3 bg-gradient-to-r from-[#a4ac86] to-[#333d29] text-white font-medium'>Submit</button>
        </form>
        }

        {!isOtpSubmitted && isEmailSent && 
        <form onSubmit={onSubmitOtp} className='bg-[#656d4a] p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit otp sent to your email id.</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input type="text" maxLength='1' key={index} required className='w-12 h-12 bg-[#333d29] text-white outline-none text-center text-xl rounded-md'
              ref={e => inputRefs.current[index] = e} 
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <button className='w-full py-2.5 bg-gradient-to-r from-[#a4ac86] to-[#333d29] text-white rounded-full'>Verify OTP</button>
        </form>
        }

        {isOtpSubmitted && isEmailSent && 
        <form onSubmit={onSubmitNewPasword} className='bg-[#656d4a] p-8 rounded-lg shadow-lg w-96 text-gray-300 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the new password below.</p>
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333d29]'>
          <img src={assets.lock_icon} className='w-3 h-full sm:w-5'/>
          <input type="password"
          required
          placeholder='New Password'
          className='bg-transparent outline-none text-white'
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          />
        </div>
        <button className='w-full rounded-full py-2.5 mt-3 bg-gradient-to-r from-[#a4ac86] to-[#333d29] text-white font-medium'>Submit</button>
        </form>
        }

    </div>
  )
}

export default ResetPassword