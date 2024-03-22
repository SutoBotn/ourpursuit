import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
      {
        id: "home",
        title: "Home",
        url: "/home"
      },
      {
        id: "askshare",
        title: "Ask & Share",
        url: "/askshare"
      },
      {
        id: "discussion",
        title: "Discussion",
        url: "/discussion"
      },
      {
        id: "account",
        title: "Account",
        url: "/account/",
        sublinks: [
          "/account/user-details",
          "/account/uploads",
          "/account/saved-posts",
          "/login"
        ]
      },
    ];

  return (
    <nav className="container relative mx-auto flex flex-wrap pt-6 pb-5 justify-between items-center">
      {/* Navbar content */}
      <Link
        className="font-Better text-7xl leading-none inline-block mr-4 whitespace-nowrap text-brown"
        to="/home"
      >
        Our Pursuit
      </Link>

      {/* Desktop Navigation */}
      <ul className="list-none md:flex hidden justify-end items-center flex-1">
        {navLinks.map((nav) => (
          <li
            key={nav.id}
            className="uppercase font-bold cursor-pointer text-md mr-10"
            onClick={() => setIsOpen(false)}
          >
            <Link
              to={nav.url}
              className={`${
                (location.pathname === nav.url) || (nav.sublinks && nav.sublinks.includes(location.pathname)) || (location.pathname.includes(nav.url)) ? 'text-green' : 'text-brown'
              }`}
            >
              {nav.title}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile Navigation */}
      <div className="md:hidden flex flex-1 justify-end items-center">
        {/* Mobile Sidebar */}
        <div
          className={`${
            isOpen ? 'flex' : 'hidden'
          } p-6 bg-green absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl z-50`}
        >
          <ul className="list-none flex justify-end items-start flex-1 flex-col">
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className="font-bold cursor-pointer text-md mb-4"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <Link
                  to={nav.url}
                  className={`${
                    location.pathname === nav.url ? 'text-cream' : 'text-brown'
                  }`}
                >
                  {nav.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex flex-col h-6 w-6 rounded items-start group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div
            className={`h-1 w-6 my-[3px] rounded-full bg-brown transition ease transform duration-300 ${
              isOpen ? "rotate-45 translate-y-1.5 opacity-50 group-hover:opacity-100" : ""
            }`}
          />
          <div
            className={`h-1 w-6 my-[3px] rounded-full bg-brown transition ease transform duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <div
            className={`h-1 w-6 my-[3px] rounded-full bg-brown transition ease transform duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2.5 opacity-50 group-hover:opacity-100" : ""
            }`}
          />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
