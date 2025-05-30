import { useTranslation } from "react-i18next";
import { ChevronUp } from "lucide-react";
import React, { useState } from "react";
import Flag from "react-world-flags"; // Importer react-world-flags
import { motion } from "framer-motion"; // Importer framer-motion pour les animations

const Header = ({ title }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false); // Etat pour contrôler l'ouverture du menu

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setIsOpen(false); // Fermer le menu après sélection
  };

  return (
    <header className="relative bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700 z-50">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center relative z-50">
      <div className="flex items-center gap-3">
      <a href="/dashboard">
        <img src="/tiktok.png" alt="Logo" className="w-10 h-10" />
      </a>
      </div>

        {/* Sélecteur de langue avec menu déroulant */}
        <div className="relative z-50">
          <button
            className="flex items-center space-x-2 text-gray-100 hover:bg-gray-600 px-3 py-2 rounded-md transition-all duration-150 ease-in-out"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Flag
              code={i18n.language === "fr" ? "FR" : "US"}
              alt="language flag"
              style={{ width: "20px", height: "auto" }}
            />
            <span>{i18n.language === "fr" ? "Français" : "English"}</span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="ml-auto"
            >
              <ChevronUp size={16} />
            </motion.div>
          </button>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-gray-800 absolute right-0 mt-2 shadow-lg rounded-lg w-32 py-2 z-50 border border-gray-700"
            >
              <button
                className="flex items-center w-full px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-all duration-150 ease-in-out"
                onClick={() => changeLanguage("fr")}
              >
                <Flag
                  code="FR"
                  alt="French Flag"
                  style={{ width: "20px", height: "auto" }}
                />
                <span className="ml-2">Français</span>
              </button>
              <button
                className="flex items-center w-full px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-all duration-150 ease-in-out"
                onClick={() => changeLanguage("en")}
              >
                <Flag
                  code="US"
                  alt="English Flag"
                  style={{ width: "20px", height: "auto" }}
                />
                <span className="ml-2">English</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
