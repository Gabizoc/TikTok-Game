import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-t border-gray-700 mt-auto">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-gray-400 text-sm">
                    © {new Date().getFullYear()} TikTok Game | {t('All rights reserved')}.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
