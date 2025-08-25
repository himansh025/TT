import { useState, memo } from "react";
import { Clock } from "lucide-react";

// Memoized Brand Component
const Brand = memo(() => (
  <div className="flex items-center space-x-3">
    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
      <Clock className="w-6 h-6 text-white" />
    </div>
    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      CollegeTime
    </span>
  </div>
));

// Memoized Desktop Navigation
const DesktopNav = memo(() => (
  <nav className="hidden md:flex items-center space-x-8">
    <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
    <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
    <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
    <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
      Get Started
    </button>
  </nav>
));

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <header className="fixed w-full top-0 z-50 bg-white/90 border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Brand />

          <DesktopNav />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col w-6 h-6 cursor-pointer"
            onClick={toggleMenu}
          >
            <span
              className={`bg-gray-600 block h-0.5 w-6 rounded-sm transition-transform duration-300 ease-out ${
                isMenuOpen ? "rotate-45 translate-y-1.5" : "-translate-y-0.5"
              }`}
            ></span>
            <span
              className={`bg-gray-600 block h-0.5 w-6 rounded-sm my-0.5 transition-opacity duration-300 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`bg-gray-600 block h-0.5 w-6 rounded-sm transition-transform duration-300 ease-out ${
                isMenuOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-0.5"
              }`}
            ></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transform origin-top transition-transform duration-300 ${
            isMenuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
          }`}
        >
          <nav className="pt-4 pb-2 flex flex-col">
            <a href="#home" className="block py-2 text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </a>
            <a href="#features" className="block py-2 text-gray-700 hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#about" className="block py-2 text-gray-700 hover:text-blue-600 transition-colors">
              About
            </a>
            <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg">
              Get Started
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
