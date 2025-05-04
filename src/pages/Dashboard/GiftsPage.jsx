import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import Header from "../../components/dashboard/common/Header";
import Footer from "../../components/dashboard/common/Footer";
import StatCard from "../../components/dashboard/common/StatCard";

import { AlertTriangle, ArrowUpNarrowWide, Package, Coins } from "lucide-react";
import GiftRepartitionChart from "../../components/dashboard/gifts/GiftRepartitionChart";
import GiftsChart from "../../components/dashboard/gifts/GiftsChart";
import ProductsTable from "../../components/dashboard/gifts/ProductsTable";

const ProductsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="flex-1 overflow-auto relative">
      <Header title={t("Gifts")} />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          cpi
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name={t("Total Gifts")}
            icon={Package}
            value={1234}
            color="#EC4899"
          />
          <StatCard
            name={t("Top Gifts")}
            icon={ArrowUpNarrowWide}
            value="Rosa"
            color="#EC4899"
          />
          <StatCard
            name={t("Total Coins")}
            icon={Coins}
            value={23}
            color="#EC4899"
          />
        </motion.div>

        <div className="grid grid-col-1 lg:grid-cols-2 gap-8 mb-8">
          <GiftsChart />
          <GiftRepartitionChart />
        </div>

        <ProductsTable />
      </main>
      <Footer />
    </div>
  );
};
export default ProductsPage;
