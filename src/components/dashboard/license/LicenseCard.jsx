import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const LicenseCard = ({ name, description, price, benefits, featured, onBuy }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      className={`bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-visible rounded-xl border flex flex-col transition-shadow duration-300 ease-in-out 
        ${featured ? "shadow-[0_25px_50px_-12px_rgba(236,72,154,0.51)] border-purple-700 border-2" : "shadow-lg border-gray-700"}
      `}
    >
      <div className="px-6 py-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-indigo-500 to-purple-600 uppercase tracking-wider">
            {name}
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{price}</span>
            <span className="text-sm text-slate-400">{t('/mois')}</span>
          </div>
          <p className="mt-2 text-sm text-slate-400">{description}</p>
        </div>

        <div className="mt-6 space-y-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-500/10">
                <svg
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4 text-pink-400"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </div>
              <p className="text-sm font-medium text-white">{benefit}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <motion.button
            className="group w-full flex items-center justify-center gap-2 text-pink-400 border border-pink-500 rounded-xl px-4 py-3 transition hover:bg-pink-500 hover:bg-opacity-10 hover:text-pink-500"
            onClick={onBuy}
            whileTap={{ scale: 0.98 }}
          >
            {t('Buy')}
            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default LicenseCard;