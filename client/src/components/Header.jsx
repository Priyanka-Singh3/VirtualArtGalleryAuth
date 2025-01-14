
import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { assets } from '../assets/assets'
import {useNavigate} from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate ();
  return (

  

    <div className=" relative h-screen bg-cover bg-center flex flex-col justify-center items-center text-white text-center" style={{ backgroundImage: `url(${assets.bg})` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10">
      <h1 className="text-[64px] mb-5">
        <h1 className="text-[44px]  font-pacifico">Welcome to</h1>
        <Typewriter
          words={['Virtual Art Gallary']}
          loop={true}
          cursor
          cursorStyle="|"
          typeSpeed={80}
          deleteSpeed={80}
          delaySpeed={2000}
        />
      </h1>
      <button onClick={() => navigate("/signup")} className="px-6 py-3 bg-[#656d4a] rounded-full shadow-lg hover:bg-[#718355]">
        Sign Up
      </button>
      </div>
      
         
    </div>
  );
};

export default Header;


