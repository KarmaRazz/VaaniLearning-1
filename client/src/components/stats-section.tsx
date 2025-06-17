import React from 'react';

interface StatCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  bgColor: string;
}

function StatCard({ title, subtitle, icon, bgColor }: StatCardProps) {
  return (
    <div className={`group relative ${bgColor} p-6 rounded-xl shadow-md text-center overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg`}>
      {/* Text Content */}
      <div className="relative z-10 transform group-hover:-translate-y-3 transition-transform duration-300 ease-in-out">
        <h3 className="text-2xl md:text-3xl font-bold text-[#333333] mb-2">
          {title}
        </h3>
        <p className="text-sm md:text-base text-[#666666] font-medium">
          {subtitle}
        </p>
      </div>
      
      {/* Animated Icon */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
        <div className="text-[#F26B1D] mb-2">
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
      bgColor: "bg-[#FFF7ED]",
      icon: (
        <svg viewBox="0 0 64 64" fill="currentColor" className="w-12 h-12">
          <path d="M32 32c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0 4c-5.34 0-16 2.68-16 8v4h32v-4c0-5.32-10.66-8-16-8z"/>
          <circle cx="20" cy="20" r="3" opacity="0.6"/>
          <circle cx="44" cy="20" r="3" opacity="0.6"/>
          <circle cx="20" cy="44" r="3" opacity="0.6"/>
          <circle cx="44" cy="44" r="3" opacity="0.6"/>
        </svg>
      )
    },
    {
      title: "50,000+",
      subtitle: "Mock Tests",
      bgColor: "bg-[#FDEDED]",
      icon: (
        <svg viewBox="0 0 64 64" fill="currentColor" className="w-12 h-12">
          <rect x="12" y="8" width="40" height="48" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
          <rect x="18" y="16" width="28" height="3" rx="1"/>
          <rect x="18" y="24" width="20" height="3" rx="1"/>
          <rect x="18" y="32" width="24" height="3" rx="1"/>
          <circle cx="20" cy="42" r="2" fill="currentColor"/>
          <circle cx="28" cy="42" r="2" fill="currentColor"/>
          <circle cx="36" cy="42" r="2" fill="currentColor"/>
          <circle cx="44" cy="42" r="2" fill="currentColor"/>
        </svg>
      )
    },
    {
      title: "25,000+",
      subtitle: "Video Lectures",
      bgColor: "bg-[#F0F9FF]",
      icon: (
        <svg viewBox="0 0 64 64" fill="currentColor" className="w-12 h-12">
          <rect x="8" y="12" width="48" height="32" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
          <polygon points="26,20 26,36 38,28" fill="currentColor"/>
          <circle cx="48" cy="20" r="3" opacity="0.6"/>
          <rect x="20" y="48" width="24" height="4" rx="2"/>
          <rect x="28" y="52" width="8" height="4" rx="2"/>
        </svg>
      )
    },
    {
      title: "10,000+",
      subtitle: "Practice Papers",
      bgColor: "bg-[#F0FDF4]",
      icon: (
        <svg viewBox="0 0 64 64" fill="currentColor" className="w-12 h-12">
          <rect x="16" y="8" width="32" height="44" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
          <rect x="20" y="16" width="24" height="2" rx="1"/>
          <rect x="20" y="22" width="20" height="2" rx="1"/>
          <rect x="20" y="28" width="22" height="2" rx="1"/>
          <rect x="20" y="34" width="18" height="2" rx="1"/>
          <rect x="20" y="40" width="24" height="2" rx="1"/>
          <rect x="12" y="12" width="8" height="8" opacity="0.3" rx="1"/>
          <rect x="44" y="12" width="8" height="8" opacity="0.3" rx="1"/>
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
            Trusted by Thousands of <span className="text-[#F26B1D]">Learners</span>
          </h2>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Join our growing community of successful students across Nepal
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              subtitle={stat.subtitle}
              icon={stat.icon}
              bgColor={stat.bgColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}