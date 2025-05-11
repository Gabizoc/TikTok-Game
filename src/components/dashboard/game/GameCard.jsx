import { motion } from "framer-motion";
import { PlayCircle, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

const GameCard = ({ title, description, launches, image, onLaunch, isFavorite, onToggleFavorite }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-visible shadow-lg rounded-xl border border-gray-700 flex flex-col transition-shadow duration-300 ease-in-out"
      whileHover={{ boxShadow: "0 25px 50px -12px rgba(236, 72, 154, 0.51)" }}
    >
      <div className="relative h-40 w-full overflow-hidden rounded-t-xl">
        <img src={image} alt={title} className="object-cover w-full h-full" />

        {/* Étoile favoris en haut à droite */}
        <button
          onClick={onToggleFavorite}
          className="absolute top-2 right-2 p-1 rounded-full bg-black bg-opacity-40 hover:bg-opacity-70 transition"
        >
          <Star className={`w-6 h-6 ${isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
        </button>
      </div>

      <div className="px-4 py-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-indigo-500 to-purple-600 mb-2">
            {title}
          </h3>
          <p className="text-gray-400 text-sm">{t(description)}</p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-pink-400 font-bold">
            {launches} {t("launches")}
          </span>
          <motion.button
            className="flex items-center gap-2 text-green-500 rounded-xl border border-green-500 p-2"
            onClick={onLaunch}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            }}
            whileTap={{
              scale: 1.005,
            }}
          >
            <PlayCircle className="w-5 h-5" />
            {t("Launch")}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;
