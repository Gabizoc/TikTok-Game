import React from "react";
import { Sparkles } from "lucide-react";
// Header Component
const Footer = () => {
  return (
    <>
      {/* Footer */}
      <div className="h-1 w-full bg-blue-900/40"></div>
      <footer className="py-16 px-6 border-t border-gray-800 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-8 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Nexus</span>
            </div>

            <div className="flex space-x-8 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>
              &copy; 2024 Nexus. All rights reserved. Built with passion for the
              future.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
