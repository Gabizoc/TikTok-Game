import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useEffect, useState } from "react";

import Header from "../../components/dashboard/common/Header";
import Footer from "../../components/dashboard/common/Footer";
import StatCard from "../../components/dashboard/common/StatCard";
import Loader from "../../components/dashboard/common/Loader";
import Sidebar from "../../components/dashboard/common/Sidebar";
import Notification from "../../components/dashboard/common/Notification";

import {
  AlertTriangle,
  ArrowUpNarrowWide,
  Package,
  Coins,
  Info,
} from "lucide-react";
import GiftRepartitionChart from "../../components/dashboard/gifts/GiftRepartitionChart";
import GiftsChart from "../../components/dashboard/gifts/GiftsChart";
import GiftsTable from "../../components/dashboard/gifts/GiftsTable";

const ProductsPage = () => {
  const { t } = useTranslation();
  const [giftsData, setGiftsData] = useState([]);
  const [giftsPerDay, setGiftsPerDay] = useState([]);
  const [totalGifts, setTotalGifts] = useState(0);
  const [topGift, setTopGift] = useState("");
  const [totalDiamond, setTotalDiamonds] = useState(0);
  const [estimatedEarnings, setEstimatedEarning] = useState(0);
  const [giftsByName, setGiftsByName] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  useEffect(() => {
    const fetchGiftsData = async () => {
      try {
        const response = await axios.get(
          "/api/page/giftsended"
        );

        const {
          gifts,
          totalGifts,
          topGift,
          totalDiamonds,
          giftsPerDay,
          giftsByName,
          estimatedEarnings,
        } = response.data;

        setGiftsData(gifts);
        setTotalGifts(totalGifts);
        setTopGift(topGift);
        setTotalDiamonds(totalDiamonds);
        setEstimatedEarning(estimatedEarnings);
        setGiftsPerDay(giftsPerDay);
        setGiftsByName(giftsByName);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        showNotification(t("Error fetching gifts or no gifts"), "error");
        setLoading(false);
      }
    };

    fetchGiftsData();
  }, []);

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
        <Header title={t("Gifts")} />
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

        <div className="flex-1 relative p-4">
          <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
            <motion.div
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <StatCard
                name={t("Total Gifts")}
                icon={Package}
                value={totalGifts}
                color="#EC4899"
              />
              <StatCard
                name={t("Top Gifts")}
                icon={ArrowUpNarrowWide}
                value={topGift}
                color="#EC4899"
              />

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
                    {totalDiamond}
                    <span className="text-sm text-gray-400 ml-2">
                      ≈ {estimatedEarnings} €
                    </span>
                  </p>
                </div>

                {/* Icône Info positionnée en haut à droite */}
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
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <GiftsChart data={giftsPerDay} />
              <GiftRepartitionChart data={giftsByName} />
            </div>

            <GiftsTable data={giftsData} />
          </main>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default ProductsPage;
