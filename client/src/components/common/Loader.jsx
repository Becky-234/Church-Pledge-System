const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
  }

  const spinner = (
    <div className={`relative ${sizes[size]} text-primary-500`}>
      <div className="absolute inset-0 rounded-full bg-primary-400/30 blur-md animate-pulse" />
      <div
        className={`relative ${sizes[size]} rounded-full animate-spin`}
        style={{
          background: 'conic-gradient(from 0deg, transparent 0%, currentColor 100%)',
          WebkitMask:
            'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-ping" />
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        {spinner}
        <p className="text-sm font-medium text-secondary-400 tracking-wide animate-pulse">
          Loading...
        </p>
      </div>
    )
  }

  return <div className="flex items-center justify-center p-4">{spinner}</div>
}

export default Loader