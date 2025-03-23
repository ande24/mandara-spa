"use client"

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

export default function ChartItem({ weekIncome }) {
  const generateNDays = (n) => {
    return Array.from({ length: n }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }).reverse();
  };

  const generateRandomData = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 10));
  console.log("mydata: ", weekIncome);
  console.log("chartdata: ", generateRandomData(7));
  const data = {
    labels: generateNDays(7),
    datasets: [
      { label: "Active", data: generateRandomData, borderColor: "rgb(59, 130, 246)", backgroundColor: "rgba(59, 130, 246, 0.2)", fill: true },
      ],
  };

  const options = { responsive: true, scales: { y: { beginAtZero: true } } };

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-4 shadow rounded">
      <h2 className="text-lg font-bold mb-2">Daily Income</h2>
      <Line data={data} options={options} />
    </div>
  );
}
