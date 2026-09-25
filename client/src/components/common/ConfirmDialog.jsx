import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'

const variantStyles = {
  danger: {
    icon: 'from-red-400 to-red-600 shadow-red-500/30',
    confirmBtn: 'btn-danger',
  },
  warning: {
    icon: 'from-amber-400 to-amber-600 shadow-amber-500/30',
    confirmBtn: 'bg-amber-500 text-white hover:bg-amber-600',
  },
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  variant = 'danger',
  icon: CustomIcon,
}) => {
  const styles = variantStyles[variant] || variantStyles.danger
  const Icon = CustomIcon || AlertTriangle

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex gap-4 mb-6">
        <div
          className={`w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br ${styles.icon} shadow-lg flex items-center justify-center`}
        >
          <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <p className="text-sm text-secondary-600 leading-relaxed pt-1">{message}</p>
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="btn btn-secondary" disabled={loading}>
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className={`btn ${styles.confirmBtn}`}
          disabled={loading}
        >
          {loading ? 'Processing...' : confirmText}
        </button>
      </div>
    </Modal>
  )
}

export default ConfirmDialog