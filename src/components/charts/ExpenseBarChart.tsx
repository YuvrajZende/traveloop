'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

interface ExpenseBarChartProps {
  data: Array<{ label: string; value: number }>
  title?: string
}

export default function ExpenseBarChart({ data, title }: ExpenseBarChartProps) {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        label: title || 'Trips',
        data: data.map(d => d.value),
        backgroundColor: '#F5A623',
        borderRadius: 6,
      },
    ],
  }

  return (
    <Bar
      data={chartData}
      options={{
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      }}
    />
  )
}
