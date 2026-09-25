const PageHeader = ({ title, description, action = null }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-800">{title}</h1>
        {description && (
          <p className="text-sm text-secondary-500 mt-1">{description}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  )
}

export default PageHeader