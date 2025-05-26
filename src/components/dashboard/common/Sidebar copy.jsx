import {
  BarChart2,
  Gamepad2,
  Menu,
  Settings,
  Gift,
  LogOut,
  TrendingUp,
  Scale,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SIDEBAR_ITEMS = [
  { name: "Dashboard", icon: BarChart2, color: "#EC4899", href: "/dashboard" },
  { name: "Gifts", icon: Gift, color: "#EC4899", href: "/dashboard/gifts" },
  {
    name: "License",
    icon: Scale,
    color: "#EC4899",
    href: "/dashboard/license",
  },
  { name: "Game", icon: Gamepad2, color: "#EC4899", href: "/dashboard/game" },
  {
    name: "Settings",
    icon: Settings,
    color: "#EC4899",
    href: "/dashboard/settings",
  },
];

const Sidebar = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth > 768);

  return (
    <motion.div
      className={`relative transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit ml-1"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = location.pathname === item.href;

          return (
            <Link key={item.href} to={item.href}>
              <motion.div
                className={`relative flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 group select-none
                  ${isActive ? "bg-gray-700/60 text-white" : "hover:bg-gray-700 text-gray-300"}
                `}
              >
                {/* Arc décoratif à gauche */}
                {isActive && (
                  <motion.div
                    layoutId="active-marker"
                    className="absolute left-0 top-50% -translate-y-50% h-8 w-1.5 rounded-r-full bg-pink-500"
                  />
                )}

                <item.icon
                  size={20}
                  style={{ color: item.color, minWidth: "20px" }}
                />

                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {t(item.name)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
        </nav>

        <div className="mt-auto">
          <Link to="/dashboard/logout">
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="flex items-center p-4 text-sm font-medium rounded-lg text-red-500 hover:bg-red-800/50 bg-opacity-100 transition-colors select-none"
            >
              <LogOut size={20} style={{ minWidth: "20px" }} />
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    className="ml-4 whitespace-nowrap"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                  >
                    {t("Logout")}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
export default Sidebar;
