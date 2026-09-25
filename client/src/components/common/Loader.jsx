const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  const spinner = (
    <div
      className={`${sizes[size]} border-primary-500 border-t-transparent rounded-full animate-spin`}
    />
  )

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary-50">
        {spinner}
      </div>
    )
  }

  return <div className="flex items-center justify-center p-4">{spinner}</div>
}

export default Loader