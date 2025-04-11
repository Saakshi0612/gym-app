import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { RiFlashlightFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import BackgroundHeader from "../../assets/Base.jpg"
import Button from "./ButtonComponent";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Optional: Close menu on outside click or escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignUpClick = () => {
    navigate("/register");
  };

  return (
    <>
      <header className="shadow-md px-4 py-3 flex items-center justify-between gap-10 relative z-20">
      <div className="flex items-center gap-1 text-xl font-bold">
        <RiFlashlightFill />
        EnergyX
      </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center w-full justify-between gap-6">
          <ul className="flex gap-4">
            <li className={`border-b-2 ${location.pathname === "/" ? "border-primary-green" : "border-transparent"}`}>
              Home
            </li>
            <li className={`border-b-2 ${location.pathname === "/coaches" ? "border-primary-green" : "border-transparent"}`}>
              Coaches
            </li>
          </ul>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleLoginClick}>Log In</Button>
            <Button variant="secondary" onClick={handleSignUpClick}>Sign Up</Button>
          </div>
        </nav>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars size={20} />
          </button>
        </div>
      </header>

<div
  className="relative bg-cover bg-center text-white py-8 px-4"
  style={{ backgroundImage: `url(${BackgroundHeader})` }} // Replace with your actual path
>
  <div className=" absolute inset-0 z-0" />
  <h1 className="relative z-10 text-2xl font-semibold">Welcome!</h1>
</div>


      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-transparent backdrop-blur-sm z-20 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white/80 backdrop-blur-xs shadow-lg p-6 transform transition-transform duration-300 z-30 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="flex flex-col gap-4 text-lg">
          <li>Home</li>
          <li>Coaches</li>
        </ul>
        <div className="mt-6 flex flex-col gap-2">
          <Button variant="secondary" onClick={handleLoginClick}>Log In</Button>
          <Button variant="secondary" onClick={handleSignUpClick}>Sign Up</Button>
        </div>
      </div>
    </>
  );
};

export default Header;

