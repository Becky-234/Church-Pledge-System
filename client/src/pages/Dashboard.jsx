import { useEffect, useState } from 'react'
import { Users, Megaphone, HandCoins, Wallet } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import PageHeader from '../components/common/PageHeader'
import StatCard from '../components/common/StatCard'
import Loader from '../components/common/Loader'
import RecentActivity from '../components/dashboard/RecentActivity'
import OverdueList from '../components/dashboard/OverdueList'
import reportService from '../services/reportService'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

// Draws the "Collection Rate" text in the doughnut's empty center
const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    if (chart.config.type !== 'doughnut') return
    const { ctx, chartArea } = chart
    if (!chartArea) return
    const { left, right, top, bottom } = chartArea
    const centerX = (left + right) / 2
    const centerY = (top + bottom) / 2
    const [collected, outstanding] = chart.data.datasets[0].data
    const total = collected + outstanding
    const pct = total > 0 ? Math.round((collected / total) * 100) : 0

    ctx.save()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#1e293b'
    ctx.font = '700 26px Poppins, sans-serif'
    ctx.fillText(`${pct}%`, centerX, centerY - 8)
    ctx.fillStyle = '#94a3b8'
    ctx.font = '500 11px Poppins, sans-serif'
    ctx.fillText('COLLECTED', centerX, centerY + 14)
    ctx.restore()
  },
}

const Dashboard = () => {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchDashboard = async () => {
      try {
        const response = await reportService.getDashboard()
        if (isMounted) setData(response.data)
      } catch {
        toast.error('Failed to load dashboard')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchDashboard()
    return () => {
      isMounted = false
    }
  }, [])

  if (loading) return <Loader fullScreen />
  if (!data) return null

  const barData = {
    labels: ['Pledged', 'Collected', 'Balance'],
    datasets: [
      {
        label: 'Amount (UGX)',
        data: [data.totalPledged, data.totalCollected, data.balance],
        backgroundColor: ['#f0894f', '#34d399', '#fbbf24'],
        hoverBackgroundColor: ['#e85d3a', '#10b981', '#f59e0b'],
        borderRadius: 10,
        borderSkipped: false,
        maxBarThickness: 56,
      },
    ],
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { family: 'Poppins', weight: '600', size: 12 },
        bodyFont: { family: 'Poppins', size: 12 },
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (ctx) => `UGX ${Number(ctx.raw).toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          font: { family: 'Poppins', size: 12, weight: '500' },
          color: '#64748b',
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(148, 163, 184, 0.15)' },
        border: { display: false },
        ticks: {
          font: { family: 'Poppins', size: 11 },
          color: '#94a3b8',
          callback: (value) =>
            value >= 1000000
              ? `${value / 1000000}M`
              : value >= 1000
              ? `${value / 1000}K`
              : value,
        },
      },
    },
  }

  const doughnutData = {
    labels: ['Collected', 'Outstanding'],
    datasets: [
      {
        data: [data.totalCollected, data.balance],
        backgroundColor: ['#34d399', '#f0894f'],
        hoverBackgroundColor: ['#10b981', '#e85d3a'],
        borderWidth: 4,
        borderColor: '#ffffff',
        hoverOffset: 6,
      },
    ],
  }

  const doughnutOptions = {
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: { family: 'Poppins', size: 12, weight: '500' },
          color: '#475569',
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { family: 'Poppins', weight: '600', size: 12 },
        bodyFont: { family: 'Poppins', size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => `UGX ${Number(ctx.raw).toLocaleString()}`,
        },
      },
    },
  }

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'User'}!`}
        description="Overview of all pledges, collections, and members"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Users}
          label="Total Members"
          value={data.totalMembers}
          color="primary"
        />
        <StatCard
          icon={Megaphone}
          label="Campaigns"
          value={data.totalCampaigns}
          color="info"
        />
        <StatCard
          icon={HandCoins}
          label="Total Pledged"
          value={`UGX ${Number(data.totalPledged).toLocaleString()}`}
          color="warning"
        />
        <StatCard
          icon={Wallet}
          label="Total Collected"
          value={`UGX ${Number(data.totalCollected).toLocaleString()}`}
          color="success"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="glass-card">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-secondary-800">
              Pledges Overview
            </h3>
            <span className="text-xs text-secondary-400">This period</span>
          </div>
          <div className="h-72 pt-3">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
        <div className="glass-card">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-secondary-800">
              Collection Progress
            </h3>
            <span className="text-xs text-secondary-400">This period</span>
          </div>
          <div className="h-72 pt-3">
            <Doughnut
              data={doughnutData}
              options={doughnutOptions}
              plugins={[centerTextPlugin]}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity + Overdue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card">
          <h3 className="font-semibold text-secondary-800 mb-4">
            Recent Collections
          </h3>
          <RecentActivity collections={data.recentCollections || []} />
        </div>
        <div className="glass-card">
          <h3 className="font-semibold text-secondary-800 mb-4">
            Overdue Pledges
          </h3>
          <OverdueList pledges={data.overduePledges || []} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard