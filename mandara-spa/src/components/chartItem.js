"use client"

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler } from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler);

export default function ChartItem({ chartData, endDate }) {
  const generateNDays = (n) => {
    return Array.from({ length: n }, (_, i) => {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
    }).reverse();
  };

  const data = {
    labels: generateNDays(7),
    datasets: [
      { label: "Income", data: chartData, borderColor: "#301414", backgroundColor: "rgba(48, 20, 20, 0.2)", fill: false },
      ],
  };

  const options = { responsive: true, scales: { y: { beginAtZero: true } } };

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-4 shadow rounded">
      <Line data={data} options={options} />
    </div>
  );
}
