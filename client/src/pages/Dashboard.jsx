import { useEffect, useState } from 'react'
import {
  Users,
  Megaphone,
  HandCoins,
  Wallet,
  TrendingUp,
  DollarSign,
} from 'lucide-react'
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
        backgroundColor: ['#e85d3a', '#10b981', '#f59e0b'],
        borderRadius: 8,
      },
    ],
  }

  const doughnutData = {
    labels: ['Collected', 'Outstanding'],
    datasets: [
      {
        data: [data.totalCollected, data.balance],
        backgroundColor: ['#10b981', '#e85d3a'],
        borderWidth: 0,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
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

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Collection Rate</p>
              <p className="text-xl font-bold text-secondary-800">
                {data.collectionRate}%
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Outstanding Balance</p>
              <p className="text-xl font-bold text-secondary-800">
                UGX {Number(data.balance).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-secondary-500">Total Collections</p>
              <p className="text-xl font-bold text-secondary-800">
                {data.totalCollections}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="card">
          <h3 className="font-semibold text-secondary-800 mb-4">
            Pledges Overview
          </h3>
          <div className="h-64">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold text-secondary-800 mb-4">
            Collection Progress
          </h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={doughnutData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity + Overdue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold text-secondary-800 mb-4">
            Recent Collections
          </h3>
          <RecentActivity collections={data.recentCollections || []} />
        </div>
        <div className="card">
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