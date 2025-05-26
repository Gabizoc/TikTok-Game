import { Tv, Users, Coins, Info, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import axios from "axios";

import Footer from "../../components/dashboard/common/Footer";
import Header from "../../components/dashboard/common/Header";
import Loader from "../../components/dashboard/common/Loader";
import Sidebar from "../../components/dashboard/common/Sidebar";
import Notification from "../../components/dashboard/common/Notification";

import StatCard from "../../components/dashboard/common/StatCard";
import GainChart from "../../components/dashboard/dashboard/GainChart";
import GiftRepartitionChart from "../../components/dashboard/gifts/GiftRepartitionChart";
import AIInsights from "../../components/dashboard/dashboard/AIInsights";

const DashboardPage = () => {
  const { t } = useTranslation();
  const [totalDiamond, setTotalDiamonds] = useState(0);
  const [estimatedEarnings, setEstimatedEarning] = useState(0);
  const [loading, setLoading] = useState(true);
  const [giftsByName, setGiftsByName] = useState([]);
  const [totalViewers, setTotalViewers] = useState(0);
  const [totalSession, setTotalSession] = useState(0);
  const [pseudo, setPseudo] = useState("anonyme");
  const [earnings6Months, setEarnings6Months] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  useEffect(() => {
    const fetchGiftsData = async () => {
      try {
        const response = await axios.get(
          "/api/page/dashboard"
        );

        const {
          earnings6Months,
          totalDiamonds,
          estimatedEarnings,
          totalViewers,
          giftsByName,
          totalSessions,
          pseudo,
        } = response.data;

        setEarnings6Months(earnings6Months);
        setTotalDiamonds(totalDiamonds);
        setEstimatedEarning(estimatedEarnings);
        setGiftsByName(giftsByName);
        setTotalViewers(totalViewers);
        setTotalSession(totalSessions);
        setPseudo(pseudo), setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        showNotification(t("Error fetching data"), "error");
        setLoading(false);
      }
    };

    fetchGiftsData();
  }, []);

  const fetchAiAnalysis = async () => {
    setLoadingAi(true);
    try {
      const { data } = await axios.get(
        "/api/page/dashboard/analysis"
      );
      setAiAnalysis(data.aiAnalysis);
    } catch (err) {
      console.error("Erreur IA :", err);
      showNotification(t("Error during the analyse"), "error");
    } finally {
      setLoadingAi(false);
    }
  };

  if (loading)
    return (
      <div className="overflow-auto relative min-h-screen w-screen flex flex-col">
        <Header title={t("Gifts")} />
        <div className="flex flex-1 items-center justify-center">
          {/* Sidebar */}
          <div className="w-16">
            <Sidebar />
          </div>
          <Loader />
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="flex min-h-screen overflow-auto flex-col w-full">
      {/* Header */}
      <div>
        <Header title={t("Dashboard")} />
      </div>

      {notification && (
        <Notification 
          className="top-20 z-300 right-4 relative"
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-16">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 relative p-4">
          <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
            <motion.div
              className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl border border-gray-700 shadow-lg p-6 mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2 flex-wrap">
                <img src="/waving.svg" alt="wave" className="w-10 h-10" />

                <span className="block sm:hidden">
                  {t("Welcome,")}{" "}
                  <span className="text-pink-400">{pseudo}</span> !
                </span>

                <span className="hidden sm:block md:hidden">
                  {t("Welcome,")}{" "}
                  <span className="text-pink-400">{pseudo}</span> !
                </span>

                <span className="hidden md:block">
                  {t("Welcome to your dashboard,")}{" "}
                  <span className="text-pink-400">{pseudo}</span> !
                </span>
              </h1>

              <p className="text-gray-400 text-sm block sm:hidden">
                {t("Analyze and boost your TikTok lives with our AI tool.")}
              </p>

              <p className="text-gray-400 text-sm hidden sm:block md:hidden">
                {t(
                  "Track your streams, earnings, and audience with advanced AI analytics."
                )}
              </p>

              <p className="text-gray-400 text-sm hidden md:block">
                {t(
                  "Monitor your TikTok lives, analyze your performance, and boost your audience. Centralize your earnings, gifts, and viewers with AI insights to go further."
                )}
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <motion.div
                className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-visible shadow-lg rounded-xl border border-gray-700"
                whileHover={{
                  y: -5,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div className="px-4 py-5 sm:p-6">
                  <span className="flex items-center text-sm font-medium text-gray-400">
                    <Coins size={20} className="mr-2 text-[#EC4899]" />
                    {t("Total Diamonds")}
                  </span>
                  <p className="mt-1 text-3xl font-semibold text-gray-100">
                    {totalDiamond || 0}
                    <span className="text-sm text-gray-400 ml-2">
                      ≈ {estimatedEarnings} €
                    </span>
                  </p>
                </div>

                <a
                  href="/forum"
                  className="absolute top-4 right-4 group text-blue-500 hover:text-blue-600 transition font-bold"
                >
                  <Info className="w-5 h-5 text-pink-500" />
                  <span className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                    {t("Learn more")} ?
                  </span>
                </a>
              </motion.div>
              <StatCard
                name={t("Total Viewers")}
                icon={Users}
                value={totalViewers}
                color="#EC4899"
              />
              <StatCard
                name={t("Total Stream")}
                icon={Tv}
                value={totalSession}
                color="#EC4899"
              />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <GainChart data={earnings6Months} />
              <GiftRepartitionChart data={giftsByName} />
            </div>

            <AIInsights
              message={aiAnalysis}
              onGenerate={fetchAiAnalysis}
              loading={loadingAi}
            />
          </main>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};
export default DashboardPage;
