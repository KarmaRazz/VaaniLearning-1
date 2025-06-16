import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import OverlapFeatures from "@/components/overlap-features";
import ExamCategories from "@/components/exam-categories";
import FeaturedCourses from "@/components/featured-courses";
import FeatureCards from "@/components/feature-cards";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <Hero />
      <OverlapFeatures />
      <ExamCategories />
      <FeaturedCourses />
      <FeatureCards />
      
      {/* Call to Action Section */}
      <section className="py-16 bg-[#FDF7F3]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-6">
            Ready to Start Your Success Journey?
          </h2>
          <p className="text-xl text-[#444444] mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students who have achieved their dreams with Vaani. Start your preparation today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#F26B1D] text-white px-8 py-4 text-lg font-bold hover:bg-[#D72638] transition-colors duration-200 shadow-md hover:shadow-lg">
              Start Free Trial
            </Button>
            <Button
              variant="outline"
              className="border-2 border-[#F26B1D] text-[#F26B1D] hover:bg-[#F26B1D] hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-200"
            >
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F8EDEB] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#F26B1D]">Vaani</h3>
              <p className="text-[#333333] text-sm leading-relaxed">
                Nepal's most trusted platform for Lok Sewa and CEE preparation.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-[#333333] hover:text-[#F26B1D] transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-[#333333] hover:text-[#F26B1D] transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-[#333333] hover:text-[#F26B1D] transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-[#333333] hover:text-[#F26B1D] transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-base font-semibold text-[#F26B1D] mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[#333333] hover:text-[#D72638] transition text-sm font-medium">About Us</a></li>
                <li><a href="#" className="text-[#333333] hover:text-[#D72638] transition text-sm font-medium">Courses</a></li>
                <li><a href="#" className="text-[#333333] hover:text-[#D72638] transition text-sm font-medium">Pricing</a></li>
                <li><a href="#" className="text-[#333333] hover:text-[#D72638] transition text-sm font-medium">Contact</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-base font-semibold text-[#F26B1D] mb-4">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[#333333] hover:text-[#D72638] transition text-sm font-medium">Help Center</a></li>
                <li><a href="#" className="text-[#333333] hover:text-[#D72638] transition text-sm font-medium">Terms of Service</a></li>
                <li><a href="#" className="text-[#333333] hover:text-[#D72638] transition text-sm font-medium">Privacy Policy</a></li>
                <li><a href="#" className="text-[#333333] hover:text-[#D72638] transition text-sm font-medium">Refund Policy</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-base font-semibold text-[#F26B1D] mb-4">Contact</h4>
              <div className="space-y-3">
                <p className="flex items-center text-[#333333] text-sm">
                  <Phone className="h-4 w-4 mr-3 text-[#F26B1D]" /> +977 98XXXXXXXX
                </p>
                <p className="flex items-center text-[#333333] text-sm">
                  <Mail className="h-4 w-4 mr-3 text-[#F26B1D]" /> support@vaani.np
                </p>
                <p className="flex items-center text-[#333333] text-sm">
                  <MapPin className="h-4 w-4 mr-3 text-[#F26B1D]" /> Kathmandu, Nepal
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#333333]/20 mt-10 pt-8 text-center">
            <p className="text-[#333333] text-sm">&copy; 2024 Vaani. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
