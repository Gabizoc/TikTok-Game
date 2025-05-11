import { motion, AnimatePresence } from "framer-motion";
import { Bot, ArrowRight, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

// Fonction de transformation simple du Markdown vers du HTML
const parseMarkdown = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // **gras**
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // *italique*
    .replace(/(^|\n)\* (.*?)(?=\n|$)/g, "$1• $2<br>") // * liste -> puce
    .replace(/\n/g, "<br>") // saut de ligne
    .replace(/<br><br>/g, "<br>"); // éviter les doubles <br>
};

const AIInsight = ({ message, onGenerate, loading }) => {
  const { t } = useTranslation();
  const renderedMessage = parseMarkdown(message);

  return (
    <motion.div
      className="flex flex-col gap-4 bg-gray-800 bg-opacity-60 backdrop-blur-lg p-5 rounded-xl border border-gray-700 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Discussion IA */}
      {message === "" ? (
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-pink-500 bg-opacity-20 rounded-full">
            <Bot className={`size-6 text-pink-400`} />
          </div>
          <div>
            <div className="flex items-center space-x-2 group">
              <p className="text-sm font-semibold text-pink-400 cursor-pointer group-hover:underline group-hover:text-pink-500">
                Ai Power Up
              </p>
              <div className="flex items-center gap-1 bg-pink-600/10 border border-pink-500 text-pink-400 px-2 py-1 rounded-full text-[10px] font-semibold">
                {t("BETA")}
              </div>
            </div>
            <div className="mt-1 bg-gray-900 bg-opacity-50 rounded-lg p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-gray-300 text-sm"
                >
                  <p>
                    {t("Click to generate your")} <strong>{t("AI analysis")}</strong> {t("and get personalised advice.")}.
                  </p>
                  <div className="flex mt-4">
                    <motion.button
                      className={`group flex items-center justify-center gap-2 rounded-xl px-4 py-2 transition
                        ${
                          loading
                            ? "cursor-not-allowed bg-gray-600 text-gray-400 border-gray-500"
                            : "text-pink-400 border border-pink-500 hover:bg-pink-500 hover:bg-opacity-10 hover:text-pink-500"
                        }`}
                      onClick={onGenerate}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      disabled={loading}
                    >
                      <span className="flex items-center gap-2">
                        {loading ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 animate-spin" />
                            {t("Generation in progress...")}
                          </>
                        ) : (
                          <>{t("AI analysis")}</>
                        )}
                      </span>
                      {!loading && (
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-pink-500 bg-opacity-20 rounded-full">
            <Bot className={`size-6 text-pink-400`} />
          </div>
          <div>
            <div className="flex items-center space-x-2 group">
              <p className="text-sm font-semibold text-pink-400 cursor-pointer group-hover:underline group-hover:text-pink-500">
                Ai Power Up
              </p>
              <div className="flex items-center gap-1 bg-pink-600/10 border border-pink-500 text-pink-400 px-2 py-1 rounded-full text-[10px] font-semibold">
                {t("BETA")}
              </div>
            </div>
            <div className="mt-1 bg-gray-900 bg-opacity-50 rounded-lg p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={message}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-gray-300 text-sm"
                  dangerouslySetInnerHTML={{ __html: renderedMessage }}
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AIInsight;
