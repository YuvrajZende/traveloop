'use client'

import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface BudgetPieChartProps {
  data: Array<{ label: string; amount: number }>
}

export default function BudgetPieChart({ data }: BudgetPieChartProps) {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [
      {
        data: data.map(d => d.amount),
        backgroundColor: [
          '#F5A623', '#2D6A4F', '#1E1E1E', '#6B7280', '#E5E7EB',
          '#EF4444', '#3B82F6', '#8B5CF6',
        ],
        borderWidth: 0,
      },
    ],
  }

  return (
    <div className="w-full max-w-xs mx-auto">
      <Pie data={chartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
    </div>
  )
}
