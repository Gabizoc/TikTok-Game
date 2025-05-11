import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTranslation } from "react-i18next";

const GiftsChart = ({ data }) => {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-medium mb-4 text-gray-100">
          {t("Number of Gifts Per Day")}
        </h2>
        <p className="text-gray-400">{t("No data available")}</p>
      </motion.div>
    );
  }

  return (
	<motion.div
	  className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
	  initial={{ opacity: 0, y: 20 }}
	  animate={{ opacity: 1, y: 0 }}
	  transition={{ delay: 0.3 }}
	>
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        {t("Number of Gifts Per Day")}
      </h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
              labelFormatter={(label) => `${label}`}
              formatter={(value) => [`${value}`, t("Gifts")]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              name={t("Gifts")}
              stroke="#ea698b"
              dot={{ fill: "#ea698b", strokeWidth: 1, r: 5 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default GiftsChart;
