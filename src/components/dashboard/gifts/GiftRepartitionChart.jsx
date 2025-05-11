import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useTranslation } from "react-i18next";
import chroma from "chroma-js";

const GiftRepartitionChart = ({ data }) => {
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
          {t("Gifts Repartition")}
        </h2>
        <p className="text-gray-400">{t("No data available")}</p>
      </motion.div>
    );
  }

  const generateColors = (numColors) => {
    return chroma.scale(["#ea698b", "#6d23b6"]).mode("lab").colors(numColors);
  };

  const colors = generateColors(data.length);

  const chartData = data.map((item) => ({
    ...item,
    name: item.gift_name,
  }));

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl pt-6 pr-6 pl-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        {t("Gifts Repartition")}
      </h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis
              dataKey="name"
              stroke="#E5E7EB"
              tick={{
                angle: -45,
                textAnchor: "end",
                fill: "#E5E7EB",
                fontSize: 12,
              }}
              interval={0}
              height={80}
            />
            <YAxis stroke="#E5E7EB" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.9)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
              formatter={(value) => [`${value} ${t("Gifts")}`]}
            />
            <Bar dataKey="totalGiftName">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default GiftRepartitionChart;
