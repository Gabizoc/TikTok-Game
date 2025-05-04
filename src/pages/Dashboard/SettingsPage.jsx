import { useTranslation } from "react-i18next";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Trash2, Save } from "lucide-react";

import Header from "../../components/dashboard/common/Header";
import Footer from "../../components/dashboard/common/Footer";

const SettingsPage = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true,
  });

  return (
    <div className="flex-1 overflow-auto relative">
      <Header title={t("Settings")} />

      <main className="max-w-5xl mx-auto py-6 px-4 lg:px-8">
        {/* Profile */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <User className="text-pink-500 mr-4" size={24} />
            <h2 className="text-xl font-semibold text-gray-100">
              {t("Profile")}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center mb-6">
            <div className="w-20 h-20 rounded-full border-2 border-pink-500 text-pink-500 flex items-center justify-center font-semibold text-3xl mr-4 mb-4 mt-4 p-10">
              LI
            </div>

            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={t("First Name")}
                  className="bg-gray-700 text-white p-2 rounded border border-gray-600 w-full"
                  defaultValue="Lorem"
                />
                <input
                  type="text"
                  placeholder={t("Last Name")}
                  className="bg-gray-700 text-white p-2 rounded border border-gray-600 w-full"
                  defaultValue="Ipsum"
                />
                <input
                  type="email"
                  placeholder={t("Email")}
                  className="bg-gray-700 text-white p-2 rounded border border-gray-600 w-full"
                  defaultValue="lorem-ipsum@dolor.sit"
                />
                <input
                  type="tel"
                  placeholder={t("Phone")}
                  className="bg-gray-700 text-white p-2 rounded border border-gray-600 w-full"
                  defaultValue="+33 6 12 34 56 78"
                />
              </div>
            </div>
          </div>

          <motion.button
            className="w-auto flex items-center justify-center gap-2 text-pink-400 border border-pink-500 rounded-xl px-3 py-2 transition hover:bg-pink-500 hover:bg-opacity-10 hover:text-pink-500"
            whileTap={{ scale: 0.98 }}
          >
            <Save />
            {t("Save")}
          </motion.button>
        </motion.div>

        {/* Notifications */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <Bell className="text-pink-500 mr-4" size={24} />
            <h2 className="text-xl font-semibold text-gray-100">
              {t("Notifications")}
            </h2>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-gray-200">{t("Email Notifications")}</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked="email"
                onChange={() => console.log("Email notifications toggled")}
                className="sr-only"
              />
              <div
                className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${
                  true ? "bg-pink-600" : "bg-gray-600"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                    true ? "translate-x-5" : ""
                  }`}
                />
              </div>
            </label>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          className="bg-red-900 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-red-700 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <Trash2 className="text-red-400 mr-3" size={24} />
            <h2 className="text-xl font-semibold text-gray-100">
              {t("Danger Zone")}
            </h2>
          </div>

          <p className="text-gray-300 mb-4">
            {t("Permanently delete your account and all of your content.")}
          </p>

          <button className="rounded-xl px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold transition duration-200">
            {t("Delete Account")}
          </button>
        </motion.div>
      </main>
    </div>
  );
};

export default SettingsPage;
