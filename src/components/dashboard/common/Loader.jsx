import { useTranslation } from "react-i18next";

const Loader = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center w-full h-[70vh] gap-6 text-white z-10">
      <div className="flex flex-col gap-4 items-center justify-center">
        <div className="w-20 h-20 border-4 border-transparent text-purple-400 animate-spin flex items-center justify-center border-t-purple-400 rounded-full">
          <div className="w-16 h-16 border-4 border-transparent text-pink-400 animate-spin flex items-center justify-center border-t-pink-400 rounded-full" />
        </div>
        <p className="text-lg text-pink-300 font-medium">{t("Loading...")}</p>
      </div>
    </div>
  );
};

export default Loader;
