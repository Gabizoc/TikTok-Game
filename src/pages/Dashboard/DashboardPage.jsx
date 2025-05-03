import { Tv, Users, Euro } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import Footer from "../../components/dashboard/common/Footer";
import Header from "../../components/dashboard/common/Header";

import StatCard from "../../components/dashboard/common/StatCard";
import GainChart from "../../components/dashboard/dashboard/GainChart";
import GiftRepartitionChart from "../../components/dashboard/gifts/GiftRepartitionChart";
import ViewerChart from "../../components/dashboard/dashboard/ViewerChart";
import AIPoweredInsights from "../../components/dashboard/analytics/AIPoweredInsights";

const DashboardPage = () => {
	const { t } = useTranslation();
	return (
		<div className='flex-1 overflow-auto relative'>
			<Header title={t('Dashboard')} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name={t('Total Gain')} icon={Euro} value='12,34€' color='#EC4899' />
					<StatCard name={t('Total Viewers')} icon={Users} value='1,234' color='#EC4899' />
					<StatCard name={t('Total Stream')} icon={Tv} value='12' color='#EC4899' />
				</motion.div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<GainChart />
					<GiftRepartitionChart />
					<ViewerChart />
				</div>

				<AIPoweredInsights />
			</main>
			<Footer />

		</div>
	);
};
export default DashboardPage;
