import { Route, Routes } from "react-router-dom";

import Sidebar from "./components/dashboard/common/Sidebar";

import OverviewPage from "./pages/dashboard/DashboardPage";
import ProductsPage from "./pages/dashboard/GiftsPage";
import LicencePage from "./pages/dashboard/LicencePage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import GamePage from "./pages/dashboard/GamePage";
import "./i18n";

function App() {
	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			{/* BG */}
			<div className='fixed inset-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>

			<Sidebar />
			<Routes>
				<Route path='/' element={<OverviewPage />} />
				<Route path='/gifts' element={<ProductsPage />} />
				<Route path='/license' element={<LicencePage />} />
				<Route path='/analytics' element={<AnalyticsPage />} />
				<Route path='/settings' element={<SettingsPage />} />
				<Route path='/game' element={<GamePage />} />
			</Routes>
		</div>
	);
}

export default App;
