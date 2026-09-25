import { AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import EmptyState from '../common/EmptyState'

const OverdueList = ({ pledges = [] }) => {
  if (!pledges.length) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="All caught up!"
        description="No overdue pledges at the moment."
      />
    )
  }

  return (
    <div className="space-y-3">
      {pledges.map((item) => (
        <div
          key={item._id}
          className="flex items-center gap-3 p-3 rounded-lg bg-red-50/50 hover:bg-red-50 transition"
        >
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-secondary-800 truncate">
              {item.member?.name || 'Unknown member'}
            </p>
            <p className="text-xs text-secondary-500">
              Due {format(new Date(item.dueDate), 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-red-600">
              UGX {Number(item.amount - item.amountPaid).toLocaleString()}
            </p>
            <p className="text-xs text-secondary-500">outstanding</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default OverdueList