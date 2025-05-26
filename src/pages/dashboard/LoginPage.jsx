import { useTranslation } from "react-i18next";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Mail } from "lucide-react";

import Header from "../../components/dashboard/common/Header";
import Footer from "../../components/dashboard/common/Footer";
import Notification from "../../components/dashboard/common/Notification";

const LoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(t("Please fill in all fields"));
        } else if (response.status === 401) {
          throw new Error(t("Invalid email or password"));
        } else {
          throw new Error(data.error || "Login failed");
        }
      }
  
      showNotification(t("Login successful"), "success");
      console.log("Login successful", data.user);
  
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (err) {
      showNotification(err.message, "error");
    }
  }; 

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 text-gray-200 overflow-auto">
      <Header title={t("Login")} />

      <main className="flex flex-1 items-center justify-center p-6">
        {notification && (
          <Notification
            className="top-20 z-300 right-4 relative"
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <motion.div
          className="bg-gray-800 bg-opacity-60 backdrop-blur-md rounded-xl border border-gray-700 shadow-lg p-8 max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl mb-6 flex items-center justify-center gap-3 font-semibold text-pink-500">
            <User size={28} /> {t("Login")}
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
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

            <motion.button
              type="submit"
              className="w-full py-3 rounded-xl bg-pink-600 text-white font-semibold hover:bg-pink-700 transition"
              whileTap={{ scale: 0.97 }}
            >
              {t("Login")}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            {t("Don't have an account?")}{" "}
            <a
              href="/dashboard/register"
              className="text-pink-500 hover:underline"
            >
              {t("Register")}
            </a>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
