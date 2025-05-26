import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

import GameCard from "../../components/dashboard/game/GameCard";
import Header from "../../components/dashboard/common/Header";
import Footer from "../../components/dashboard/common/Footer";
import Loader from "../../components/dashboard/common/Loader";
import Sidebar from "../../components/dashboard/common/Sidebar";
import Notification from "../../components/dashboard/common/Notification";

const GameListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [hasFetched, setHasFetched] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };
  
  const fetchGames = async () => {
    try {
      setError(false);
      setLoading(true);
      const res = await axios.get("/api/game/games");
      setGames(res.data);
    } catch (err) {
      console.error("Erreur chargement jeux :", err);
      showNotification(t("Erreur during fetching games"), "error");
      setError(true);
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const toggleFavorite = async (gameId) => {
    try {
      const isFav = favorites.has(gameId);
      if (isFav) {
        await axios.delete("/api/game/favorites", {
          data: { game_id: gameId },
        });
        setFavorites((prev) => {
          const newFavs = new Set(prev);
          newFavs.delete(gameId);
          return newFavs;
        });
      } else {
        await axios.post("/api/game/favorites", {
          game_id: gameId,
        });
        setFavorites((prev) => new Set(prev).add(gameId));
      }
    } catch (err) {
      console.error("Erreur toggle favoris :", err);
      showNotification(t("Error during toggle favoris"), "error");
    } finally {
      fetchGames();
    }
  };

  return (
    <div className="flex min-h-screen overflow-auto flex-col w-full">
      {/* Header */}
      <div>
        <Header title={t("Game")} />
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
          <main className="w-full py-6 px-6 sm:px-10 flex-grow">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-2 pb-2">
                {t("Choose your game !")}
              </h2>
              <p className="text-lg sm:text-xl text-gray-500">
                {t(
                  "Discover interactive games designed for livestreams. Boost your audience's engagement in real time."
                )}
              </p>
            </motion.div>

            {loading ? (
              <Loader />
            ) : error ? (
              <motion.div
                className="mt-10 flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-center text-lg sm:text-xl text-gray-400 mb-2 mt-5">
                  {t("Oops! We couldn't load the games.")}
                </p>
                <p className="text-sm text-gray-500 max-w-md text-center">
                  {t(
                    "Please check your internet connection or try again later."
                  )}
                </p>

                <button
                  onClick={fetchGames}
                  className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow hover:scale-105 transition-transform duration-200"
                >
                  {t("Retry")}
                </button>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: 0.2,
                    },
                  },
                }}
                initial="hidden"
                animate={hasFetched ? "show" : "hidden"}
              >
                {games.map((game) => (
                  <motion.div
                    key={game.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <GameCard
                      key={game.id}
                      title={game.title}
                      description={game.description}
                      launches={game.launches}
                      image={game.image}
                      onLaunch={() => navigate(`/dashboard/game/${game.id}`)}
                      isFavorite={game.is_favorite}
                      onToggleFavorite={() => toggleFavorite(game.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </main>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default GameListPage;
