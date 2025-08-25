import React from 'react';

const Stats = () => {
  const stats = [
    { number: '500+', label: 'Active Students' },
    { number: '50+', label: 'Teachers' },
    { number: '25+', label: 'Classrooms' },
    { number: '99.9%', label: 'Uptime' }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fadeIn">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trusted by Our Academic Community
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Join hundreds of students and teachers who have streamlined their academic scheduling with our platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center animate-slideInUp bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 animate-countUp">
                {stat.number}
              </div>
              <div className="text-blue-100 font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
            <p className="text-blue-100 mb-6">
              Transform your academic scheduling experience today. It's free, easy, and takes less than 2 minutes to set up.
            </p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg">
              Start Your Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;