import React from 'react';

interface StatCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  bgColor: string;
}

function StatCard({ title, subtitle, imageUrl, bgColor }: StatCardProps) {
  return (
    <div className={`group relative ${bgColor} w-full h-[200px] rounded-xl shadow-md text-center overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg`}>
      {/* Text Content - Centered by default, moves up significantly on hover */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:top-8 group-hover:-translate-y-0 transition-all duration-300">
        <h3 className="text-2xl md:text-3xl font-bold text-[#333333] mb-2">
          {title}
        </h3>
        <p className="text-sm md:text-base text-[#666666] font-medium">
          {subtitle}
        </p>
      </div>
      
      {/* Animated Image - Appears in bottom area on hover */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 translate-y-8 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <img
          src={imageUrl}
          alt={subtitle}
          className="w-16 h-16 object-contain"
        />
      </div>
    </div>
  );
}

export default function StatsSection() {
  const stats = [
    {
      title: "5000+",
      subtitle: "Happy Students",
      bgColor: "bg-[#FFF7ED]",
      imageUrl: "/attached_assets/Add a little bit of body text_1750156322363.png"
    },
    {
      title: "1000+",
      subtitle: "Mock Tests",
      bgColor: "bg-[#FDEDED]",
      imageUrl: "/attached_assets/Add a little bit of body text (1)_1750156419542.png"
    },
    {
      title: "500+",
      subtitle: "Video Lectures",
      bgColor: "bg-[#F0F9FF]",
      imageUrl: "/attached_assets/Add a little bit of body text (2)_1750156656848.png"
    },
    {
      title: "2000+",
      subtitle: "Practice Papers",
      bgColor: "bg-[#F0FDF4]",
      imageUrl: "/attached_assets/Add a little bit of body text (3)_1750156723703.png"
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
              imageUrl={stat.imageUrl}
              bgColor={stat.bgColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}