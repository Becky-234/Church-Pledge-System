import { Inbox } from 'lucide-react'

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No data found',
  description = 'Nothing to display here yet.',
  action = null,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-secondary-400" />
      </div>
      <h3 className="text-lg font-semibold text-secondary-700 mb-1">{title}</h3>
      <p className="text-sm text-secondary-500 max-w-md mb-4">{description}</p>
      {action}
    </div>
  )
}

export default EmptyState