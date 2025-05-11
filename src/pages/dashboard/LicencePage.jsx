import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import Header from "../../components/dashboard/common/Header";
import Footer from "../../components/dashboard/common/Footer";

import LicenseCard from "../../components/dashboard/license/LicenseCard";

const LicensesPage = () => {
  const { t } = useTranslation();
  const handleBuy = (licenseName) => {
    console.log(`Achat de la licence : ${licenseName}`);
  };

  const licenses = [
    {
      id: 1,
      name: t("Standard License"),
      description: t("Basic license with essential features."),
      price: "$10",
      benefits: [t("Basic features"), t("Standard support")],
      isCurrent: false
    },
    {
      id: 2,
      name: t("Pro License"),
      description: t("Advanced license with more resources."),
      price: "$30",
      benefits: [
        t("Advanced features"),
        t("Priority support"),
        t("Frequent updates"),
      ],
      featured: true,
      isCurrent: true
    },
    {
      id: 3,
      name: t("Enterprise License"),
      description: t("Premium license for businesses."),
      price: "$50",
      benefits: [
        t("Premium features"),
        t("Dedicated support"),
        t("Full access to updates"),
      ],
      isCurrent: false
    },
  ];

  return (
    <div className="flex-1 relative overflow-auto height-screen">
      <Header title={t("License")} />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-2 pb-2">
            {t("Choose your perfect license")}
          </h2>
          <p className="text-lg sm:text-xl text-gray-500">
            {t(
              "Select a license that best fits your needs. Each plan offers different features and benefits."
            )}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {licenses.map((license) => (
            <LicenseCard
              key={license.id}
              name={license.name}
              description={license.description}
              price={license.price}
              benefits={license.benefits}
              featured={license.featured}
              isCurrent={license.isCurrent}
              onBuy={() => handleBuy(license.name)}
            />
          ))}
        </motion.div>

        <motion.section
          className="max-w-7xl mx-auto px-4 pb-20 mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h3 className="text-3xl sm:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 pb-2 mb-10">
            {t("Ils ont testé")} FUTUR NOM
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Carte 1 */}
            <div className="border border-gray-700 rounded-2xl shadow-xl bg-gray-800 bg-opacity-50 backdrop-blur-md p-6 space-y-4 flex flex-col h-full">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold rounded-full">
                  DJ
                </div>
                <div>
                  <div className="text-white font-medium">Donald Jackman</div>
                  <div className="text-gray-400 text-sm">
                    {t("Créateur de contenu")}
                  </div>
                </div>
              </div>

              <div className="flex text-yellow-400 text-xl">★★★★★</div>

              <p className="text-gray-300 text-sm flex-grow">
                {t(
                  "J'utilise FUTUR NOM depuis plusieurs mois. Super simple pour gérer mes jeux en live, et un support au top."
                )}
              </p>

              <div className="text-purple-400 font-medium cursor-pointer hover:underline text-sm mt-auto">
                {t("Lire plus")}
              </div>
            </div>

            {/* Carte 2 */}
            <div className="border border-gray-700 rounded-2xl shadow-xl bg-gray-800 bg-opacity-50 backdrop-blur-md p-6 space-y-4 flex flex-col h-full">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold rounded-full">
                  AM
                </div>
                <div>
                  <div className="text-white font-medium">Alice Moore</div>
                  <div className="text-gray-400 text-sm">
                    {t("Développeuse full-stack")}
                  </div>
                </div>
              </div>

              <div className="flex text-yellow-400 text-xl">★★★★★</div>

              <p className="text-gray-300 text-sm flex-grow">
                {t(
                  "Disponibilité incroyable et panel fluide pour gérer mes jeux TikTok. Idéal pour mes projets dev."
                )}
              </p>

              <div className="text-purple-400 font-medium cursor-pointer hover:underline text-sm mt-auto">
                {t("Lire plus")}
              </div>
            </div>

            {/* Carte 3 */}
            <div className="border border-gray-700 rounded-2xl shadow-xl bg-gray-800 bg-opacity-50 backdrop-blur-md p-6 space-y-4 flex flex-col h-full">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold rounded-full">
                  SR
                </div>
                <div>
                  <div className="text-white font-medium">Samuel R.</div>
                  <div className="text-gray-400 text-sm">
                    {t("Fondateur de startup")}
                  </div>
                </div>
              </div>

              <div className="flex text-yellow-400 text-xl">★★★★★</div>

              <p className="text-gray-300 text-sm flex-grow">
                {t(
                  "Abordable et fiable. Un service parfait pour faire grandir nos jeux interactifs en live."
                )}
              </p>

              <div className="text-purple-400 font-medium cursor-pointer hover:underline text-sm mt-auto">
                {t("Lire plus")}
              </div>
            </div>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default LicensesPage;
