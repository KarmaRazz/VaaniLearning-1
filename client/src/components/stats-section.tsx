import React from 'react';

interface StatCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

function StatCard({ title, subtitle, icon }: StatCardProps) {
  return (
    <div className="group relative bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden">
      {/* Text Content */}
      <div className="relative z-10 transform group-hover:-translate-y-2 transition-transform duration-300 ease-in-out">
        <h3 className="text-3xl md:text-4xl font-bold text-[#333333] mb-2">
          {title}
        </h3>
        <p className="text-lg text-[#666666] font-medium">
          {subtitle}
        </p>
      </div>
      
      {/* Animated Icon */}
      <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transform translate-y-10 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
        <div className="text-6xl text-[#F26B1D] mb-4">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function StatsSection() {
  const stats = [
    {
      title: "15 Million+",
      subtitle: "Happy Students",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      )
    },
    {
      title: "500+",
      subtitle: "Expert Teachers",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
        </svg>
      )
    },
    {
      title: "1000+",
      subtitle: "Video Lessons",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
          <path d="M8 5v14l11-7z"/>
        </svg>
      )
    },
    {
      title: "95%",
      subtitle: "Success Rate",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 bg-[#FDF7F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
            Our <span className="text-[#F26B1D]">Achievement</span>
          </h2>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Join millions of students who trust Vaani for their exam preparation
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              subtitle={stat.subtitle}
              icon={stat.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}