import React, { useState } from 'react'

const Login = () => {
  const [state, setState] = useState('Sign up');
  return (
    <div className='flex items-center justify-center bg-red-200 min-h-screen px-6 sm:px-0 bg-gradient-to-br from-[#c2c5aa] to-[#656d4a]'>
        <div>
          <h3 className='absolute left-5 sm:left-20 top-5 text-2xl cursor-pointer'><span className=''>Virtual </span>Art Gallary</h3>
        </div>
        <div>
          <h2>{state === 'Sign up' ? 'Create Account' : 'Login' }</h2>
          <p>{state === 'Sign up' ? 'Create Your Account' : 'Login to your account !' }</p>
        </div>

    </div>
  )
}

export default Login