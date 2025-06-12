import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import FeatureCards from "@/components/feature-cards";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <Hero />
      <FeatureCards />
      
      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-primary-orange to-primary-red">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Success Journey?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have achieved their dreams with Vaani. Start your preparation today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-primary-orange px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg">
              Start Free Trial
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-orange px-8 py-4 text-lg font-semibold transition-all duration-200"
            >
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary-orange">Vaani</h3>
              <p className="text-gray-300">
                Nepal's most trusted platform for Lok Sewa and CEE preparation.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-primary-orange transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-primary-orange transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-primary-orange transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-primary-orange transition-colors">
                  <Youtube className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-primary-orange transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary-orange transition-colors">Courses</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary-orange transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary-orange transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-primary-orange transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary-orange transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary-orange transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary-orange transition-colors">Refund Policy</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-300">
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" /> +977 98XXXXXXXX
                </p>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" /> support@vaani.np
                </p>
                <p className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" /> Kathmandu, Nepal
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Vaani. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
