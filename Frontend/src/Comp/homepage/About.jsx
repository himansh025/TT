import React from 'react';
import image2 from '../../assets/home/image2.jpeg'
const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slideInLeft">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Our 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Project</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              CollegeTime was born from the everyday struggles students and teachers face with managing complex academic schedules. 
              We recognized the need for a unified platform that could eliminate the confusion and inefficiency of traditional timetabling systems.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Real-time Updates</h4>
                  <p className="text-gray-600">Stay informed with instant notifications about schedule changes</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">User-Friendly Interface</h4>
                  <p className="text-gray-600">Intuitive design that anyone can navigate effortlessly</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Cross-Platform Access</h4>
                  <p className="text-gray-600">Access your schedule anywhere, anytime, on any device</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative animate-slideInRight">
            <img 
              src={image2} 
              alt="College campus"
              className="rounded-2xl shadow-2xl w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-2xl"></div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;