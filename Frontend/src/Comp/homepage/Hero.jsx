import React from 'react';
import image1 from "../../assets/home/image1.jpeg";
const Hero = () => {
    return (
        <section id="home" className="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="animate-slideInLeft">
                        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                            College
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Timetable</span>
                            <br />Management
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Revolutionize your academic scheduling with our intelligent timetable system.
                            Find live lectures, manage weekly schedules, and discover vacant classrooms - all in one place.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                                Start Managing Now
                            </button>

                        </div>
                    </div>

                    <div className="relative animate-slideInRight">
                        <div className="relative z-5">
                            <img
                                src={image1}
                                alt="Students in classroom"
                                loading="lazy"
                                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                            />

                            <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-80 animate-bounce"></div>
                            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-80 animate-pulse"></div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;