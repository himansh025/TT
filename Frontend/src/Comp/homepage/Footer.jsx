import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CT</span>
              </div>
              <h3 className="text-2xl font-bold">CollegeTime</h3>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Revolutionizing academic scheduling with smart, intuitive timetable management 
              for students and teachers everywhere.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 cursor-pointer">
                <span className="text-sm">📧</span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 cursor-pointer">
                <span className="text-sm">📱</span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 cursor-pointer">
                <span className="text-sm">🌐</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-white transition-colors duration-200">Home</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors duration-200">Features</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors duration-200">About</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2025 CollegeTime. All rights reserved. Built with ❤️ for academic excellence.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;