const StatCard = ({ icon: Icon, label, value, trend, color = 'primary', featured = false }) => {
  const colors = {
    primary: { icon: 'bg-primary-100 text-primary-600' },
    success: { icon: 'bg-emerald-100 text-emerald-600' },
    warning: { icon: 'bg-amber-100 text-amber-600' },
    danger: { icon: 'bg-red-100 text-red-600' },
    info: { icon: 'bg-blue-100 text-blue-600' },
  }

  if (featured) {
    return (
      <div className="rounded-xl p-5 bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-sm text-white/80 mb-1">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {trend && (
              <span className="inline-block mt-2 text-xs font-semibold text-white bg-white/20 px-2 py-0.5 rounded-full">
                {trend}
              </span>
            )}
          </div>
          {Icon && (
            <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card !p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-secondary-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-secondary-800">{value}</p>
          {trend && (
            <span className="inline-block mt-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colors[color].icon}`}>
            <Icon className="w-5 h-5" strokeWidth={2} />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard