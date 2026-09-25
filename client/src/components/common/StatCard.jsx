const StatCard = ({ icon: Icon, label, value, trend, color = 'primary' }) => {
  const colors = {
    primary: { bg: 'from-primary-400 to-primary-600', glow: 'shadow-primary-500/40' },
    success: { bg: 'from-emerald-400 to-emerald-600', glow: 'shadow-emerald-500/40' },
    warning: { bg: 'from-amber-400 to-amber-600', glow: 'shadow-amber-500/40' },
    danger: { bg: 'from-red-400 to-red-600', glow: 'shadow-red-500/40' },
    info: { bg: 'from-blue-400 to-blue-600', glow: 'shadow-blue-500/40' },
  }

  return (
    <div className="glass-card !p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[color].bg} shadow-lg ${colors[color].glow} flex items-center justify-center`}
        >
          {Icon && <Icon className="w-6 h-6 text-white" fill="white" strokeWidth={0} />}
        </div>
        {trend && (
          <span className="text-xs font-semibold text-emerald-600">{trend}</span>
        )}
      </div>
      <p className="text-sm text-secondary-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-secondary-800">{value}</p>
    </div>
  )
}

export default StatCard