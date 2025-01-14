import React from 'react';
import { assets } from '../assets/assets';
import Navbar from '../components/Navbar';
import Header from '../components/Header';

const Home = () => {
  

  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <Header />
    </div>
  );
};

export default Home;
