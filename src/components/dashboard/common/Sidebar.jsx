import {
  BarChart2,
  Settings,
  Gift,
  Gamepad2,
  Scale,
  LogOut,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useTranslation } from "react-i18next";

import Notification from "./Notification";

const Sidebar = () => {
  const { t } = useTranslation();
  const [isFixed, setIsFixed] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const location = useLocation();
  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);
  const [login, setLogin] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  useEffect(() => {
    const fetchGiftsData = async () => {
      try {
        const response = await axios.get("/api/user/connected");

        setLogin(response.data.loggedIn);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        showNotification(t("You are not connect !"), "error");
        setLoading(false);
      }
    };

    fetchGiftsData();
  }, []);

  const options = [
    {
      id: "dashboard",
      icon: <BarChart2 className="w-5 h-5" />,
      path: "/dashboard",
    },
    {
      id: "gifts",
      icon: <Gift className="w-5 h-5" />,
      path: "/dashboard/gifts",
    },
    {
      id: "license",
      icon: <Scale className="w-5 h-5" />,
      path: "/dashboard/license",
    },
    {
      id: "game",
      icon: <Gamepad2 className="w-5 h-5" />,
      path: "/dashboard/game",
    },
  ];

  // Mettre à jour la position du menu quand il s'ouvre
  useLayoutEffect(() => {
    if (profileMenuOpen && profileButtonRef.current) {
      const rect = profileButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.top,
        left: rect.right + 5, // 5px d'espacement
      });
    }
  }, [profileMenuOpen]);

  // Ferme le menu profil quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen]);

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const ProfileMenuPortal = () => {
    return createPortal(
      <motion.div
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        ref={profileMenuRef}
        style={{
          position: "fixed",
          top: `${menuPosition.top}px`,
          left: `${menuPosition.left}px`,
          zIndex: 100,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.8)",
        }}
        className="bg-gray-800 rounded-lg border border-gray-700 p-2 w-40"
      >
        <ul className="space-y-1">
          {login ? (
            <>
              <li>
                <Link
                  className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-gray-700 text-gray-300"
                  to="/dashboard/settings"
                >
                  <Settings className="w-4 h-4" />
                  <span>Paramètres</span>
                </Link>
              </li>
              <li>
                <button
                  className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-red-500 hover:bg-opacity-70 text-red-500 hover:text-gray-300 transition-colors duration-200"
                  onClick={async () => {
                    try {
                      await axios.post("/api/auth/logout");
                      window.location.href = "/dashboard/login";
                    } catch (err) {
                      console.error("Erreur lors de la déconnexion :", err);
                    }
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/dashboard/register"
                  className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-gray-700 text-gray-300"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>S'inscrire</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/login"
                  className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-gray-700 text-gray-300"
                >
                  <User className="w-4 h-4" />
                  <span>Se connecter</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </motion.div>,
      document.body
    );
  };

  return (
    <div
      className={`flex flex-col justify-center items-center w-18 py-4 min-h-screen ${
        isFixed ? "fixed top-0 left-0" : ""
      }`}
    >
      {notification && (
        <Notification
          className="top-20 z-300 right-4 relative"
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {/* Menu de navigation */}
      <nav className="flex flex-col gap-4 bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl border border-gray-700 shadow-lg p-3">
        {options.map((option) => (
          <Link
            key={option.id}
            to={option.path}
            className="relative cursor-pointer flex items-center justify-center w-10 h-10"
          >
            <div
              className={`${
                location.pathname === option.path
                  ? "bg-pink-600 text-white"
                  : "bg-transparent text-gray-400 hover:bg-gray-800"
              } flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300`}
            >
              {option.icon}
            </div>
            <span
              className={`absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-pink-600 transition-opacity
            ${location.pathname === option.path ? "opacity-100" : "opacity-0"}`}
            />
          </Link>
        ))}

        {/* Bouton du profil */}
        <div className="relative">
          <button
            ref={profileButtonRef}
            onClick={toggleProfileMenu}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 border-2 border-gray-700 hover:border-pink-500 overflow-hidden transition-all duration-300 focus:outline-none"
          >
            <div className="w-full h-full bg-gray-600 flex items-center justify-center">
            {login ? (
                <User className="w-6 h-6 text-gray-300" />
              ) : (
                <X className="w-6 h-6 text-pink-500" />
              )}
            </div>
          </button>
        </div>
      </nav>

      {/* Rendu du menu via un portail */}
      {profileMenuOpen && <ProfileMenuPortal />}
    </div>
  );
};

export default Sidebar;
