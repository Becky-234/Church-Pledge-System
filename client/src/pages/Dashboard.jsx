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

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

// Splits text into words, each wrapped for a staggered slide-up reveal
const AnimatedWords = ({ text, delayStart = 0, className = '' }) => (
  <>
    {text.split(' ').map((word, i) => (
      <span key={i} className="word-in mr-[0.3em]">
        <span
          style={{ animationDelay: `${delayStart + i * 0.08}s` }}
          className={className}
        >
          {word}
        </span>
      </span>
    ))}
  </>
)

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
        backgroundColor: '#e85d3a',
        hoverBackgroundColor: '#d94e2c',
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 48,
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
        callbacks: { label: (ctx) => `UGX ${Number(ctx.raw).toLocaleString()}` },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { font: { family: 'Poppins', size: 12, weight: '500' }, color: '#64748b' },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(148, 163, 184, 0.12)' },
        border: { display: false },
        ticks: {
          font: { family: 'Poppins', size: 11 },
          color: '#94a3b8',
          callback: (value) =>
            value >= 1000000 ? `${value / 1000000}M` : value >= 1000 ? `${value / 1000}K` : value,
        },
      },
    },
  }

  const doughnutData = {
    labels: ['Collected', 'Outstanding'],
    datasets: [
      {
        data: [data.totalCollected, data.balance],
        backgroundColor: ['#34d399', '#e85d3a'],
        borderWidth: 4,
        borderColor: '#ffffff',
        hoverOffset: 4,
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
        callbacks: { label: (ctx) => `UGX ${Number(ctx.raw).toLocaleString()}` },
      },
    },
  }

  const firstName = user?.name?.split(' ')[0] || 'User'

  return (
    <div>
      {/* Welcome — staggered word-by-word slide-up */}
      <div className="mb-6">
        <p className="text-sm font-medium text-primary-600 mb-1 word-in">
          <span style={{ animationDelay: '0s' }}>{getGreeting()}</span>
        </p>
        <h1 className="text-2xl font-bold text-secondary-800">
          <AnimatedWords text={`Welcome back, ${firstName}`} delayStart={0.1} />
        </h1>
        <p className="text-sm text-secondary-500 mt-1 word-in">
          <span style={{ animationDelay: '0.4s' }}>
            Here's what's happening with your church today.
          </span>
        </p>
      </div>

      {/* Stats Grid — first card featured with gradient */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Users}
          label="Total Members"
          value={data.totalMembers}
          featured
        />
        <StatCard icon={Megaphone} label="Campaigns" value={data.totalCampaigns} color="info" />
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
      <div className="section-label">
        <span className="text-xs font-semibold text-secondary-400 uppercase tracking-wide">
          Overview
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="glass-card">
          <h3 className="font-semibold text-secondary-800 mb-4">Pledges Overview</h3>
          <div className="h-64">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
        <div className="glass-card">
          <h3 className="font-semibold text-secondary-800 mb-4">Collection Progress</h3>
          <div className="h-64">
            <Doughnut data={doughnutData} options={doughnutOptions} plugins={[centerTextPlugin]} />
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="section-label">
        <span className="text-xs font-semibold text-secondary-400 uppercase tracking-wide">
          Activity
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card">
          <h3 className="font-semibold text-secondary-800 mb-4">Recent Collections</h3>
          <RecentActivity collections={data.recentCollections || []} />
        </div>
        <div className="glass-card">
          <h3 className="font-semibold text-secondary-800 mb-4">Overdue Pledges</h3>
          <OverdueList pledges={data.overduePledges || []} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard