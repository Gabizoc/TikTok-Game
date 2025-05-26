import { useTranslation } from "react-i18next";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Mail, Key } from "lucide-react";

import Header from "../../components/dashboard/common/Header";
import Footer from "../../components/dashboard/common/Footer";

const RegisterPage = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [surname, setSurname] = useState("");
  const [tiktokUsername, setTiktokUsername] = useState("");
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showNotification(t("Passwords don't match"), "error");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname,
          surname,
          tiktok_username: tiktokUsername,
          email,
          password,
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 400) {
          showNotification(
            data.error || "Missing fields or identifiers already used",
            "error"
          );
        } else {
          showNotification(data.error || "Unsuccessful registration", "error");
        }
        return;
      }

      showNotification(t("Successful registration"), "success");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 text-gray-200 overflow-auto">
      <Header title={t("Register")} />

      {notification && (
        <Notification
          className="top-20 z-300 right-4 relative"
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <main className="flex flex-1 items-center justify-center p-6">
        <motion.div
          className="bg-gray-800 bg-opacity-60 backdrop-blur-md rounded-xl border border-gray-700 shadow-lg p-8 md:max-w-[50%] w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl mb-6 flex items-center justify-center gap-3 font-semibold text-pink-500">
            <User size={28} /> {t("Register")}
          </h1>
          <form
            onSubmit={handleRegister}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label className="flex items-center mb-1 text-sm font-medium text-gray-400">
                <User className="mr-2 text-pink-600" size={18} />
                {t("Username")}
              </label>
              <input
                type="text"
                placeholder={t("Enter your username")}
                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 focus:ring-2 focus:ring-pink-600 focus:border-pink-500 transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="flex items-center mb-1 text-sm font-medium text-gray-400">
                <Mail className="mr-2 text-pink-600" size={18} />
                {t("Email")}
              </label>
              <input
                type="email"
                placeholder={t("Enter your email")}
                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 focus:ring-2 focus:ring-pink-600 focus:border-pink-500 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="flex items-center mb-1 text-sm font-medium text-gray-400">
                <Lock className="mr-2 text-pink-600" size={18} />
                {t("Password")}
              </label>
              <input
                type="password"
                placeholder={t("Enter your password")}
                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 focus:ring-2 focus:ring-pink-600 focus:border-pink-500 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="flex items-center mb-1 text-sm font-medium text-gray-400">
                <Key className="mr-2 text-pink-600" size={18} />
                {t("Confirm Password")}
              </label>
              <input
                type="password"
                placeholder={t("Confirm your password")}
                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 focus:ring-2 focus:ring-pink-600 focus:border-pink-500 transition"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="flex items-center mb-1 text-sm font-medium text-gray-400">
                <User className="mr-2 text-pink-600" size={18} />
                {t("First Name")}
              </label>
              <input
                type="text"
                placeholder={t("Enter your first name")}
                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 focus:ring-2 focus:ring-pink-600 focus:border-pink-500 transition"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="flex items-center mb-1 text-sm font-medium text-gray-400">
                <User className="mr-2 text-pink-600" size={18} />
                {t("Last Name")}
              </label>
              <input
                type="text"
                placeholder={t("Enter your last name")}
                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 focus:ring-2 focus:ring-pink-600 focus:border-pink-500 transition"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="flex items-center mb-1 text-sm font-medium text-gray-400">
                <User className="mr-2 text-pink-600" size={18} />
                {t("TikTok Username")}
              </label>
              <input
                type="text"
                placeholder={t("Enter your TikTok username")}
                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 focus:ring-2 focus:ring-pink-600 focus:border-pink-500 transition"
                value={tiktokUsername}
                onChange={(e) => setTiktokUsername(e.target.value)}
                required
              />
            </div>
          </form>{" "}
          {/* ferme ici la grid */}
          <div className="mt-6 flex justify-center">
            <motion.button
              type="submit"
              onClick={handleRegister}
              className="px-10 py-3 rounded-xl bg-pink-600 text-white font-semibold hover:bg-pink-700 transition"
              whileTap={{ scale: 0.97 }}
            >
              {t("Register")}
            </motion.button>
          </div>
          <div className="mt-6 text-center text-sm text-gray-400">
            {t("Already have an account?")}{" "}
            <a
              href="/dashboard/login"
              className="text-pink-500 hover:underline"
            >
              {t("Login")}
            </a>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;
