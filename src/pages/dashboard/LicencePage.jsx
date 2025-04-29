import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import Header from "../../components/dashboard/common/Header";
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
        },
        {
            id: 2,
            name: t("Pro License"),
            description: t("Advanced license with more resources."),
            price: "$30",
            benefits: [t("Advanced features"), t("Priority support"), t("Frequent updates")],
            featured: true,
        },
        {
            id: 3,
            name: t("Enterprise License"),
            description: t("Premium license for businesses."),
            price: "$50",
            benefits: [t("Premium features"), t("Dedicated support"), t("Full access to updates")],
        },
    ];

    return (
        <div className="flex-1 relative overflow-auto">
            <Header title={t("License")} />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.section
                    className="text-center mb-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-2 pb-2">
                        {t("Choose your perfect license")}
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-500" > 
                        {t("Select a license that best fits your needs. Each plan offers different features and benefits.")}
                    </p>
                </motion.section>

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
                            onBuy={() => handleBuy(license.name)}
                        />
                    ))}
                </motion.div>
            </main>
        </div>
    );
};

export default LicensesPage;
