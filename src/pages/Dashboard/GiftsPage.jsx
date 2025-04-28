import { motion } from "framer-motion";
import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";
import { useTranslation } from "react-i18next";

import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../../components/overview/GiftRepartitionChart";
import SalesTrendChart from "../../components/products/SalesTrendChart";
import ProductsTable from "../../components/products/ProductsTable";

const ProductsPage = () => {
	const { t } = useTranslation();
	return (
		<div className='flex-1 overflow-auto relative'>
			<Header title='Gifts' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name={t('Total Gifts')} icon={Package} value={1234} color='#6366F1' />
					<StatCard name={t('Top Gifts')} icon={TrendingUp} value="Rosa" color='#10B981' />
					<StatCard name={t('Total Coins')} icon={AlertTriangle} value={23} color='#F59E0B' />
				</motion.div>

				{/* CHARTS */}
				<div className='grid grid-col-1 lg:grid-cols-2 gap-8 mb-8'>
					<SalesTrendChart />
					<CategoryDistributionChart />
				</div>

				<ProductsTable />

			</main>
		</div>
	);
};
export default ProductsPage;
