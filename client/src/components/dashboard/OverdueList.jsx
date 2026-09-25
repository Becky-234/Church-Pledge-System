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
    <div className="space-y-2.5">
      {pledges.map((item) => (
        <div
          key={item._id}
          className="flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-red-100/60 hover:bg-white/90 hover:border-red-200 hover:shadow-sm transition-all duration-200"
        >
         <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-red-400 to-red-600 shadow-sm shadow-red-500/30 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-secondary-800 truncate">
              {item.member?.name || 'Unknown member'}
            </p>
            <p className="text-xs text-secondary-500">
              Due {format(new Date(item.dueDate), 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="text-right shrink-0">
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