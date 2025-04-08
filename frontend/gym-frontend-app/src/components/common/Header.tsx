import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import Button from "../common/Button";
import { RiFlashlightFill } from "react-icons/ri";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Optional: Close menu on outside click or escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      <header className="shadow-md px-4 py-3 flex items-center justify-between gap-10 relative z-20">
      <div className="flex items-center gap-1 text-xl font-bold">
  <RiFlashlightFill />
  EnergyX
</div>


        {/* Desktop Nav */}
        {/* <nav className="hidden md:flex items-center w-full  justify-between gap-6">
          <ul className="flex gap-4">
            <li>Home</li>
            <li>Coaches</li>
          </ul>
          <div className="flex gap-2">
            <Button variant="secondary">Log In</Button>
            <Button variant="secondary">Sign Up</Button>
          </div>
        </nav> */}
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
    <Button variant="secondary">Log In</Button>
    <Button variant="secondary">Sign Up</Button>
  </div>
</nav>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars size={20} />
          </button>
        </div>
      </header>

      {/* Welcome Bar */}
      <div className="bg-primary-green text-white py-2 px-4">
        <h1 className="text-lg font-semibold">Welcome</h1>
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
          <Button variant="secondary">Log In</Button>
          <Button variant="secondary">Sign Up</Button>
        </div>
      </div>
    </>
  );
};

export default Header;
