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
  {
    name: "Analytics",
    icon: TrendingUp,
    color: "#EC4899",
    href: "/dashboard/analytics",
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.href} to={item.href}>
              <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
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
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <Link to="/dashboard/logout">
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="flex items-center p-4 text-sm font-medium rounded-lg text-red-500 hover:bg-red-800/50 bg-opacity-100 transition-colors"
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
                    Logout
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
