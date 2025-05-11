import { motion } from "framer-motion";
import { Edit, Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const GiftsTable = ({ data }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGifts, setFilteredGifts] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGifts = filteredGifts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredGifts.length / itemsPerPage);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = data.filter(
      (gift) =>
        gift.gift_name.toLowerCase().includes(term) ||
        gift.author.toLowerCase().includes(term) ||
        gift.team.toLowerCase().includes(term)
    );
    setFilteredGifts(filtered);
    setCurrentPage(1)

    if (!data || data.length === 0) {
      return (
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-medium mb-4 text-gray-100">
            {t("Gifts Send List")}
          </h2>
          <p className="text-gray-400">{t("No data available")}</p>
        </motion.div>
      );
    }
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          {t("Gifts Send List")}
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search gifts ..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                {t("Author")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                {t("Date")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                {t("Diamonds")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                {t("Gift Name")}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {currentGifts.map((gift) => (
              <motion.tr
                key={gift.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {gift.author}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(gift.date).toLocaleString()}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {gift.diamond_count}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {gift.gift_name}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center items-center mt-6 space-x-3 text-white">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-40 transition"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (!isNaN(val)) {
                  setCurrentPage(Math.min(Math.max(val, 1), totalPages));
                }
              }}
              className="w-16 bg-gray-800 border border-gray-600 text-center rounded-md py-1 px-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-400">/ {totalPages}</span>
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-40 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default GiftsTable;
