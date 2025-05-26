import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Bell,
  Trash2,
  Save,
  Mail,
  Phone,
  AtSign,
  RotateCcw,
  RectangleEllipsis,
  Lock,
  Key,
  ShieldCheck,
  Shield,
  Loader,
} from "lucide-react";

import Header from "../../components/dashboard/common/Header";
import Footer from "../../components/dashboard/common/Footer";
import Sidebar from "../../components/dashboard/common/Sidebar";
import Notification from "../../components/dashboard/common/Notification";

const SettingsPage = () => {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  const [formData, setFormData] = useState({
    firstname: "",
    surname: "",
    email: "",
    phone: "",
    tiktok_username: "",
    notification_security_email: false,
    notification_information_email: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState({
    profile: false,
    password: false,
    notifications: false,
  });

  const [notification, setNotification] = useState(null);
  const [formTouched, setFormTouched] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/user/info");
        setFormData(response.data.user);
      } catch (error) {
        showNotification(t("Failed to load user data"), "error");
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [t]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!formTouched) {
      showNotification(t("No changes to save"), "error");
      return;
    }

    setLoading((prev) => ({ ...prev, profile: true }));

    try {
      await axios.patch("/api/user/update", formData);
      showNotification(t("Profile updated successfully"));
      setFormTouched(false);
    } catch (error) {
      showNotification(t("Failed to update profile"), "error");
      console.error("Error updating profile:", error);
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      showNotification(t("Please fill all password fields"), "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification(t("Passwords don't match"), "error");
      return;
    }

    if (newPassword.length < 8) {
      showNotification(t("Password must be at least 8 characters"), "error");
      return;
    }

    setLoading((prev) => ({ ...prev, password: true }));

    try {
      await axios.post("/api/user/change-password", {
        currentPassword,
        newPassword,
      });

      showNotification(t("Password updated successfully"));
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      const message = error.response?.data?.message || t("Server error");
      showNotification(message, "error");
    } finally {
      setLoading((prev) => ({ ...prev, password: false }));
    }
  };

  const toggleNotification = async (key) => {
    const newValue = !formData[key];

    setLoading((prev) => ({ ...prev, notifications: true }));

    try {
      setFormData((prev) => ({
        ...prev,
        [key]: newValue,
      }));

      await axios.patch("/api/user/notifications", {
        notification_security_email:
          key === "notification_security_email"
            ? newValue
            : formData.notification_security_email,
        notification_information_email:
          key === "notification_information_email"
            ? newValue
            : formData.notification_information_email,
      });

      showNotification(t("Notification preferences updated"));
    } catch (error) {
      setFormData((prev) => ({
        ...prev,
        [key]: !newValue,
      }));
      showNotification(t("Failed to update notification preferences"), "error");
      console.error("Error updating notifications:", error);
    } finally {
      setLoading((prev) => ({ ...prev, notifications: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormTouched(true);
  };

  const handlePasswordInputChange = (e) => {
    const { id, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [id]: value }));
  };

  const confirmDeleteAccount = () => {
    if (
      window.confirm(
        t(
          "Are you sure you want to delete your account? This action cannot be undone."
        )
      )
    ) {
      showNotification(
        t("Account deletion feature coming soon, contact support !"),
        "error"
      );
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-auto flex-col w-full">
      <div>
        <Header title={t("Settings")} />
      </div>

      {notification && (
        <Notification
          className="top-20 z-300 right-4 relative"
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex flex-1">
        <div className="w-16">
          <Sidebar />
        </div>

        <div className="flex-1 relative p-4">
          <main className="max-w-6xl mx-auto py-6 px-4 lg:px-8">
            <motion.form
              className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl border border-gray-700 shadow-lg p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleProfileSubmit}
            >
              <div className="flex items-center mb-6 border-b border-gray-700 pb-4">
                <User className="text-pink-500 mr-3" size={28} />
                <h1 className="text-xl text-white">{t("Profile")}</h1>
              </div>

              <div className="space-y-8">
                {/* Personal Information */}
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <User className="mr-2 text-pink-600" size={20} />
                    {t("Personal Information")}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="w-full">
                      <label
                        htmlFor="firstname"
                        className="block text-sm font-medium text-gray-400 mb-1 flex items-center"
                      >
                        <RectangleEllipsis
                          className="mr-1 text-gray-500"
                          size={20}
                        />
                        {t("First name")}
                      </label>
                      <input
                        id="firstname"
                        type="text"
                        onChange={handleChange}
                        name="firstname"
                        value={formData.firstname || ""}
                        placeholder={t("First name")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-500 bg-gray-800 focus:ring-2 focus:ring-pink-800 focus:border-pink-500 transition-all"
                      />
                    </div>

                    <div className="w-full">
                      <label
                        htmlFor="surname"
                        className="block text-sm font-medium text-gray-400 mb-1 flex items-center"
                      >
                        <RectangleEllipsis
                          className="mr-1 text-gray-500"
                          size={20}
                        />
                        {t("Surname")}
                      </label>
                      <input
                        id="surname"
                        onChange={handleChange}
                        name="surname"
                        type="text"
                        value={formData.surname || ""}
                        placeholder={t("Surname")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-500 bg-gray-800 focus:ring-2 focus:ring-pink-800 focus:border-pink-500 transition-all"
                      />
                    </div>
                  </div>
                </section>

                {/* Contact Details */}
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <Mail className="mr-2 text-pink-600" size={20} />
                    {t("Contact details")}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="w-full">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-400 mb-1 flex items-center"
                      >
                        <Mail className="mr-1 text-gray-500" size={16} />
                        {t("Email")}
                      </label>
                      <input
                        id="email"
                        type="email"
                        onChange={handleChange}
                        name="email"
                        value={formData.email || ""}
                        placeholder={t("Email")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-500 bg-gray-800 focus:ring-2 focus:ring-pink-800 focus:border-pink-500 transition-all"
                      />
                    </div>

                    <div className="w-full">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-400 mb-1 flex items-center"
                      >
                        <Phone className="mr-1 text-gray-500" size={16} />
                        {t("Phone")}
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        onChange={handleChange}
                        name="phone"
                        value={formData.phone || ""}
                        placeholder={t("Phone")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-500 bg-gray-800 focus:ring-2 focus:ring-pink-800 focus:border-pink-500 transition-all"
                      />
                    </div>

                    <div className="w-full">
                      <label
                        htmlFor="tiktok_username"
                        className="block text-sm font-medium text-gray-400 mb-1 flex items-center"
                      >
                        <AtSign className="mr-1 text-gray-500" size={16} />
                        {t("TikTok username")}
                      </label>
                      <input
                        id="tiktok_username"
                        type="text"
                        onChange={handleChange}
                        name="tiktok_username"
                        value={formData.tiktok_username || ""}
                        placeholder={t("TikTok username")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-500 bg-gray-800 focus:ring-2 focus:ring-pink-800 focus:border-pink-500 transition-all"
                      />
                    </div>
                  </div>
                </section>
              </div>

              {/* Save Button */}
              <div className="mt-8 flex md:justify-end">
                <motion.button
                  type="submit"
                  className="group flex items-center justify-center gap-2 rounded-xl px-4 py-3 transition text-pink-400 border border-pink-500 hover:bg-pink-500 hover:bg-opacity-10 hover:text-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.98 }}
                  disabled={loading.profile}
                >
                  <span className="flex items-center gap-2">
                    {loading.profile ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        {t("Saving...")}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {t("Save")}
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </motion.form>

            {/* Security Section */}
            <motion.form
              className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl border border-gray-700 shadow-lg p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onSubmit={handlePasswordChange}
            >
              <div className="flex items-center mb-6 border-b border-gray-700 pb-4">
                <ShieldCheck className="text-pink-500 mr-3" size={28} />
                <h1 className="text-xl text-white">{t("Security")}</h1>
              </div>

              <div className="space-y-8">
                <section>
                  <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <Lock className="mr-2 text-pink-600" size={20} />
                    {t("Password")}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="w-full">
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-400 mb-1 flex items-center"
                      >
                        <Key className="mr-1 text-gray-500" size={20} />
                        {t("Current Password")}
                      </label>
                      <input
                        className="w-full px-4 py-2 rounded-lg border border-gray-500 bg-gray-800 focus:ring-2 focus:ring-pink-800 focus:border-pink-500 transition-all"
                        id="currentPassword"
                        type="password"
                        placeholder={t("Current Password")}
                        value={passwordData.currentPassword}
                        onChange={handlePasswordInputChange}
                      />
                    </div>

                    <div className="w-full">
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-400 mb-1 flex items-center"
                      >
                        <ShieldCheck className="mr-1 text-gray-500" size={20} />
                        {t("New Password")}
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        placeholder={t("New Password")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-500 bg-gray-800 focus:ring-2 focus:ring-pink-800 focus:border-pink-500 transition-all"
                        value={passwordData.newPassword}
                        onChange={handlePasswordInputChange}
                      />
                    </div>

                    <div className="w-full">
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-400 mb-1 flex items-center"
                      >
                        <Shield className="mr-1 text-gray-500" size={20} />
                        {t("Confirm New Password")}
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        placeholder={t("Confirm New Password")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-500 bg-gray-800 focus:ring-2 focus:ring-pink-800 focus:border-pink-500 transition-all"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordInputChange}
                      />
                    </div>
                  </div>
                </section>
              </div>

              {/* Update Password Button */}
              <div className="mt-8 flex md:justify-end">
                <motion.button
                  type="submit"
                  className="group flex items-center justify-center gap-2 rounded-xl px-4 py-3 transition text-pink-400 border border-pink-500 hover:bg-pink-500 hover:bg-opacity-10 hover:text-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.98 }}
                  disabled={loading.password}
                >
                  <span className="flex items-center gap-2">
                    {loading.password ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        {t("Updating...")}
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        {t("Update Password")}
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </motion.form>

            {/* Notifications Section */}
            <motion.div
              className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center mb-6 border-b border-gray-700 pb-4">
                <Bell className="text-pink-500 mr-3" size={28} />
                <h1 className="text-xl text-white">{t("Notifications")}</h1>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-gray-200">{t("Security email")}</span>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notification_security_email}
                    onChange={() =>
                      toggleNotification("notification_security_email")
                    }
                    className="sr-only"
                    disabled={loading.notifications}
                  />
                  <div
                    className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${
                      formData.notification_security_email
                        ? "bg-pink-600"
                        : "bg-gray-600"
                    } ${loading.notifications ? "opacity-50" : ""}`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                        formData.notification_security_email
                          ? "translate-x-5"
                          : ""
                      }`}
                    />
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-gray-200">{t("Information email")}</span>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notification_information_email}
                    onChange={() =>
                      toggleNotification("notification_information_email")
                    }
                    className="sr-only"
                    disabled={loading.notifications}
                  />
                  <div
                    className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${
                      formData.notification_information_email
                        ? "bg-pink-600"
                        : "bg-gray-600"
                    } ${loading.notifications ? "opacity-50" : ""}`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                        formData.notification_information_email
                          ? "translate-x-5"
                          : ""
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
              transition={{ duration: 0.5, delay: 0.3 }}
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

              <button
                type="button"
                className="rounded-xl px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold transition duration-200"
                onClick={confirmDeleteAccount}
              >
                {t("Delete Account")}
              </button>
            </motion.div>
          </main>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default SettingsPage;
