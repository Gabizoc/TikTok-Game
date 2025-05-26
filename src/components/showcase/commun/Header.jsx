import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Info, LayoutList, Sparkles, Menu, X, Globe, ChevronDown } from "lucide-react";
import i18n from "i18next";


const navLinks = [
  { href: "#features", label: "Features", icon: Star },
  { href: "#inside", label: "Solutions", icon: LayoutList },
  { href: "#faq", label: "FAQ", icon: Info },
];

// LanguageSelector intégré en clair
const LanguageSelector = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState(i18n.language || "en");

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setLanguage(langCode);
    setIsOpen(false);
    localStorage.setItem("i18nextLng", langCode);
    document.documentElement.lang = langCode;
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-200 backdrop-blur-sm"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4 text-gray-300" aria-hidden="true" />
        <span className="text-sm font-medium text-gray-200">
          {currentLanguage.flag} {currentLanguage.name}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="w-4 h-4 text-gray-400" aria-hidden="true" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay pour fermer le menu */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-md border border-gray-600/50 rounded-lg shadow-xl z-50"
              role="listbox"
              aria-label="Language options"
            >
              {languages.map((language) => (
                <motion.button
                  key={language.code}
                  onClick={() => changeLanguage(language.code)}
                  whileHover={{ backgroundColor: "rgba(75, 85, 99, 0.5)" }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                    currentLanguage.code === language.code
                      ? "bg-pink-600/20 text-pink-300"
                      : "text-gray-200 hover:text-white"
                  }`}
                  role="option"
                  aria-selected={currentLanguage.code === language.code}
                >
                  <span className="text-lg" aria-hidden="true">
                    {language.flag}
                  </span>
                  <span className="text-sm font-medium">{language.name}</span>
                  {currentLanguage.code === language.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 bg-pink-400 rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? "py-4 bg-black/80 backdrop-blur-xl border-b border-white/10"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            TikTok Game
          </span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <motion.a
              key={href}
              href={href}
              whileHover={{ y: -2 }}
              className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white transition-colors group"
            >
              <Icon size={16} className="group-hover:text-blue-400 transition-colors" />
              <span>{label}</span>
            </motion.a>
          ))}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 shadow-lg"
          >
            Get Started
          </motion.button>

          {/* Language Selector Desktop */}
          <LanguageSelector className="ml-4" />
        </nav>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-6 py-4 space-y-4">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </a>
              ))}
              <button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 py-3 rounded-full font-medium text-sm text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg">
                Get Started
              </button>

              {/* Language Selector Mobile */}
              <div className="pt-4 border-t border-gray-700">
                <LanguageSelector />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
