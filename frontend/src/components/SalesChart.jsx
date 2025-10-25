import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { useBusinessStore } from "../store/businessStore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

// Utility: generate an array of last N days in YYYY-MM-DD
const getLastNDays = (n) => {
  const today = new Date();
  const daysArray = [];

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    daysArray.push(d.toISOString().split("T")[0]);
  }

  return daysArray;
};

// Format a date string (YYYY-MM-DD) → "Oct' 12"
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.toLocaleString("en-US", { month: "short" }); // e.g., "Oct"
  const day = date.getDate();
  return `${month}' ${day}`;
};

const SalesChart = () => {
  const { business } = useBusinessStore();
  const [days, setDays] = useState(15);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["salesChart", business?._id, days],
    enabled: !!business?._id,
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/sales-invoice/chart/${business._id}?days=${days}`
      );
      return res.data?.salesData || [];
    },
  });

  if (isLoading) return <p>Loading sales data...</p>;
  if (isError) return <p>Failed to load sales data</p>;

  // Step 1: Format backend data
  const formattedData =
    data &&
    data.map((item) => ({
      date: item._id,
      sales: item.totalSales,
    }));

  // Step 2: Fill missing days
  const allDates = getLastNDays(days);
  const mergedData = allDates.map((date) => {
    const found =
      formattedData && formattedData.find((item) => item.date === date);
    return {
      date: formatDate(date),
      sales: found ? found.sales : 0,
    };
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold mb-3">Sales (Last {days} Days)</h2>
        <div className="w-1/4">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="select select-xs w-full"
          >
            <option value={7}>Last 7 Days</option>
            <option value={15}>Last 15 Days</option>
            <option value={30}>Last 30 Days</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={mergedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            tickFormatter={(value) => {
              if (value >= 1_00_00_000)
                return `${(value / 1_00_00_000).toFixed(1)} Cr`;
              if (value >= 1_00_000)
                return `${(value / 1_00_000).toFixed(1)} L`;
              if (value >= 1_000) return `${(value / 1_000).toFixed(1)} K`;
              return value;
            }}
          />

          <Tooltip
            formatter={(value) => value.toLocaleString("en-IN")}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
