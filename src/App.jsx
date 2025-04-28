import { Route, Routes } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";

import OverviewPage from "./pages/Dashboard/DashboardPage";
import ProductsPage from "./pages/Dashboard/GiftsPage";
import UsersPage from "./pages/Dashboard/UsersPage";
import SalesPage from "./pages/Dashboard/SalesPage";
import OrdersPage from "./pages/Dashboard/OrdersPage";
import AnalyticsPage from "./pages/Dashboard/AnalyticsPage";
import SettingsPage from "./pages/Dashboard/SettingsPage";
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
				<Route path='/users' element={<UsersPage />} />
				<Route path='/sales' element={<SalesPage />} />
				<Route path='/orders' element={<OrdersPage />} />
				<Route path='/analytics' element={<AnalyticsPage />} />
				<Route path='/settings' element={<SettingsPage />} />
			</Routes>
		</div>
	);
}

export default App;
