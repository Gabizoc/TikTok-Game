import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import GameCard from "../../components/dashboard/game/GameCard";
import Header from "../../components/dashboard/common/Header";
import Footer from "../../components/dashboard/common/Footer";

const GameListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const games = [
    {
      id: 1,
      title: "2 Parts Game",
      description: t("Wichh part is the right one?"),
      launches: 123,
      image: "/Banner.jpg",
    },
    {
      id: 2,
      title: "Tic Tac Boom",
      description: t("Defuse the bomb before it's too late!"),
      launches: 78,
      image: "/Banner.jpg",
    },
    {
      id: 3,
      title: "Jackpot",
      description: t("Spin the wheel and make your fortune."),
      launches: 250,
      image: "/Banner.jpg",
    },
    {
      id: 5,
      title: "Memory",
      description: t("Test your memory with fun challenges."),
      launches: 350,
      image: "/Banner.jpg",
    },
  ];
  return (
    <div className="flex-1 overflow-auto relative">
      <Header title={t("List of Games")} />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
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
          animate="show"
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
                title={game.title}
                description={game.description}
                launches={game.launches}
                image={game.image}
                onLaunch={() => navigate(`/dashboard/game/${game.id}`)}
              />
            </motion.div>
          ))}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default GameListPage;
