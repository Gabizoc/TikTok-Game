import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const GainChart = ({ data }) => {
  const { t } = useTranslation();

  const GainData = data.map((item) => ({
	name: `${item.month}/${item.year}`,
	gain: item.estimatedEarnings,
  }));

  if (!data || data.length === 0) {
    return (
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-medium mb-4 text-gray-100">
			{t('Gain Overview')}
        </h2>
        <p className="text-gray-400">{t("No data available")}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">
        {t("Gain Overview")}
      </h2>

      <div className="h-80">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <LineChart data={GainData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
              labelFormatter={(label) => `${label}`}
              formatter={(value) => [`${value}`, t("Gain")]}
            />
            <Line
              type="monotone"
              dataKey="gain"
              stroke="#ea698b"
              strokeWidth={3}
              dot={{ fill: "#ea698b", strokeWidth: 1, r: 5 }}
              activeDot={{ r: 8, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default GainChart;
