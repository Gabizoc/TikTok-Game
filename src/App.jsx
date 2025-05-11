import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/dashboard/common/Sidebar";

import OverviewPage from "./pages/dashboard/DashboardPage";
import ProductsPage from "./pages/dashboard/GiftsPage";
import LicencePage from "./pages/dashboard/LicencePage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import GamePage from "./pages/dashboard/GamePage";
import PartPage from "./pages/dashboard/2PartPage";
import UnsupportedPage from "./pages/dashboard/UnsupportedPage";

import "./i18n";

const isMobile = () => window.innerWidth <= 768;

function App() {
  const location = useLocation();
  const pathname = location.pathname;

  const isGameRoute = pathname.startsWith("/dashboard/game/");
  if (isMobile() && isGameRoute) {
    return <Navigate to="/dashboard/unsupported" replace />;
  }

  const showSidebar =
    pathname.startsWith("/dashboard") &&
    (pathname === "/dashboard/game" || !pathname.startsWith("/dashboard/game/"));

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* BG */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      {showSidebar && <Sidebar />}
      <Routes>
        <Route path="/dashboard" element={<OverviewPage />} />
        <Route path="/dashboard/gifts" element={<ProductsPage />} />
        <Route path="/dashboard/license" element={<LicencePage />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
        <Route path="/dashboard/game" element={<GamePage />} />
        <Route path="/dashboard/game/1" element={<PartPage />} />
        <Route path="/dashboard/logout" element={<div>Logout</div>} />
        <Route path="/dashboard/unsupported" element={<UnsupportedPage />} />
      </Routes>
    </div>
  );
}

export default App;
