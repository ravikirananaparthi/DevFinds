import React, { useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { TiHome } from 'react-icons/ti';
import { BsPatchQuestionFill } from 'react-icons/bs';
import { IoMdMail } from 'react-icons/io';
import { IoCloseOutline } from 'react-icons/io5';
import { FaQuestionCircle } from 'react-icons/fa';
const Menu = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  function menu() {
    setMenuOpen(!isMenuOpen);
  }
  return (
    <div className="relative z-[za]">
      <div className="b cursor-pointer" onClick={menu}>
        <GiHamburgerMenu className="size-5" />
      </div>
      {isMenuOpen ? <div className="fixed h-screen w-full z-[za] top-0 right-0 bg-gray-800/60"></div> : ''}
      <div className={`fixed top-0 right-0 w-[400px] h-screen bg-gray-100 z-[za] duration-200 border-b ${isMenuOpen ? 'opacity-100' : 'opacity-0 invisible'}`}>
        <div className="border-b shadow-lg py-5 bg-puk relative z-[za]">
          <IoCloseOutline size={30} className="rounded-full cursor-pointer left-1 top-5 absolute" onClick={menu} />
          <h2 className="text-2xl font-semibold pl-16">DevFinds
            <span className="pl-36"><a href="https://amazon.in" className="btn border-blue-500 border-2 hover:bg-blue-500 hover:text-white transition ease-in-out duration-500">log in</a></span>
          </h2>
        </div>
        <div>
          <ul className="flex flex-col p-4 text-gray-800">
            <li className="text-xl py-3 flex">
              <TiHome size={25} className="mr-4 mt-0.5" style={{ color: "" }} />
              FAQs/Need Help
            </li>
            <li className="text-xl py-3 flex">
              <BsPatchQuestionFill size={25} className="mr-4 mt-0.5" style={{ color: "" }} />
              Home
            </li>
            <li className="text-xl py-3 flex">
              <IoMdMail size={25} className="mr-4 mt-0.5" style={{ color: "" }} />
              About Us
            </li>
            <li className="text-xl py-3 flex">
              <FaQuestionCircle size={25} className="mr-4 mt-0.5" style={{ color: "" }} />
              Contact Us
            </li>
            <li className="text-xl py-3 flex">
              <FaQuestionCircle size={25} className="mr-4 mt-0.5" style={{ color: "" }} />
              FAQs/Need Help
            </li>
            <li className="text-xl py-3 flex">
              <FaQuestionCircle size={25} className="mr-4 mt-0.5" style={{ color: "" }} />
              FAQs/Need Help
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Menu;

