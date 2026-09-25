import { formatDistanceToNow } from 'date-fns'
import { Wallet, User } from 'lucide-react'
import EmptyState from '../common/EmptyState'

const RecentActivity = ({ collections = [] }) => {
  if (!collections.length) {
    return (
      <EmptyState
        icon={Wallet}
        title="No recent activity"
        description="Collections will appear here as they are recorded."
      />
    )
  }

  return (
    <div className="space-y-3">
      {collections.map((item) => (
        <div
          key={item._id}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 transition"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-secondary-800 truncate">
              {item.member?.name || 'Unknown member'}
            </p>
            <p className="text-xs text-secondary-500">
              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-emerald-600">
              +UGX {Number(item.amount).toLocaleString()}
            </p>
            <p className="text-xs text-secondary-500 capitalize">
              {item.paymentMethod?.replace('_', ' ')}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RecentActivity