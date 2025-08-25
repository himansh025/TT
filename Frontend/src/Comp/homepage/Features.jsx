import React from 'react';
import image1 from '../../assets/home/image1.jpeg'
import image3 from '../../assets/home/image3.jpeg'
import image5 from '../../assets/home/image5.jpeg'
import image4 from '../../assets/home/image4.jpeg'
import { Link } from 'react-router';

const Features = () => {
  const features = [
    {
      icon: '🔴',
      title: 'Live Lecture Tracking',
      description: 'Instantly find ongoing lectures and never miss important classes with real-time updates.',
      image: `${image3}`,
      redirect: '/live'
    },
    {
      icon: '📅',
      title: 'Weekly Schedule View',
      description: 'Get a comprehensive overview of your entire week with beautifully organized timetables.',
      image: `${image1}`,
      redirect: '/weekly'
    },
    {
      icon: '👨‍🏫',
      title: 'Teacher Schedule Manager',
      description: 'Track all lectures for any teacher across the week and plan your academic interactions.',
      image:`${image4}`,
      redirect: '/locate'
    },
    {
      icon: '🏫',
      title: 'Vacant Classroom Finder',
      description: 'Discover available classrooms for study groups, meetings, or personal study sessions.',
      image: `${image5}`,
      redirect: '/vacant'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Everyone</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're a student trying to keep up with classes or a teacher managing multiple courses, 
            our platform has everything you need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
       {features.map((feature, index) => (
  <div 
    key={index}
    className="group bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slideInUp"
    style={{animationDelay: `${index * 0.1}s`}}
  >
    <div className="relative mb-6">
      <img 
        src={feature.image} 
        alt={feature.title}
        loading="lazy"
        className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
        {feature.icon}
      </div>
    </div>
    
    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
      {feature.title}
    </h3>
    <p className="text-gray-600 leading-relaxed">
      {feature.description}
    </p>
    
    <div className="mt-6">
      <Link 
        to={feature.redirect} 
        className="text-blue-600 font-semibold hover:text-purple-600 flex items-center space-x-2 group-hover:translate-x-1 transform transition-transform duration-200"
      >
        <span>Learn More</span>
        <span>→</span>
      </Link>
    </div>
  </div>
))}

        </div>
      </div>
    </section>
  );
};

export default Features;