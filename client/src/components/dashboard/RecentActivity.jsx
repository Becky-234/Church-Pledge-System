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
    <div className="space-y-2.5">
      {collections.map((item) => (
        <div
          key={item._id}
          className="flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-emerald-100/60 hover:bg-white/90 hover:border-emerald-200 hover:shadow-sm transition-all duration-200"
        >
          <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm shadow-emerald-500/30 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-secondary-800 truncate">
              {item.member?.name || 'Unknown member'}
            </p>
            <p className="text-xs text-secondary-500">
              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
            </p>
          </div>
          <div className="text-right shrink-0">
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