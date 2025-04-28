import { Tv, Users, Euro } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";
import GainChart from "../../components/overview/GainChart";
import GiftRepartitionChart from "../../components/overview/GiftRepartitionChart";
import ViewerChart from "../../components/overview/ViewerChart";

const OverviewPage = () => {
	const { t } = useTranslation();
	return (
		<div className='flex-1 overflow-auto relative'>
			{/* Header PAS DANS LE MOTION */}
			<Header title={t('Dashboard')} />

			{/* Là seulement le contenu animé */}
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

				{/* CHARTS */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					<GainChart />
					<GiftRepartitionChart />
					<ViewerChart />
				</div>
			</main>
		</div>
	);
};
export default OverviewPage;
