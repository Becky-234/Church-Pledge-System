import { useEffect, useState } from 'react'
import { Send, Bell, Trash2, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import PageHeader from '../components/common/PageHeader'
import Modal from '../components/common/Modal'
import EmptyState from '../components/common/EmptyState'
import Loader from '../components/common/Loader'
import notificationService from '../services/notificationService'
import memberService from '../services/memberService'
import toast from 'react-hot-toast'
import { usePermissions } from '../hooks/usePermissions'

const Notifications = () => {
  const { canSendNotifications } = usePermissions()
  const [notifications, setNotifications] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [sending, setSending] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const fetchData = async () => {
    try {
      const [nRes, mRes] = await Promise.all([
        notificationService.getAll(),
        memberService.getAll(),
      ])
      setNotifications(nRes.data)
      setMembers(mRes.data)
    } catch {
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const [nRes, mRes] = await Promise.all([
          notificationService.getAll(),
          memberService.getAll(),
        ])
        if (isMounted) {
          setNotifications(nRes.data)
          setMembers(mRes.data)
        }
      } catch {
        toast.error('Failed to load notifications')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  const openCreate = () => {
    if (!canSendNotifications) return
    reset({
      recipient: '',
      type: 'announcement',
      channel: 'in_app',
      subject: '',
      message: '',
    })
    setModalOpen(true)
  }

  const onSubmit = async (data) => {
    try {
      await notificationService.create(data)
      toast.success('Notification sent')
      setModalOpen(false)
      fetchData()
    } catch {
      toast.error('Failed to send')
    }
  }

  const handleSendReminders = async () => {
    setSending(true)
    try {
      const res = await notificationService.sendReminders()
      toast.success(res.message || 'Reminders sent')
      fetchData()
    } catch {
      toast.error('Failed to send reminders')
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await notificationService.delete(id)
      toast.success('Deleted')
      fetchData()
    } catch {
      toast.error('Delete failed')
    }
  }

  const getTypeBadge = (type) => {
    const map = {
      reminder: 'badge-warning',
      confirmation: 'badge-success',
      announcement: 'badge-info',
    }
    return map[type] || 'badge-secondary'
  }

  const getStatusBadge = (status) => {
    const map = {
      sent: 'badge-success',
      pending: 'badge-warning',
      failed: 'badge-danger',
    }
    return map[status] || 'badge-secondary'
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Send reminders and manage notifications"
        action={
          canSendNotifications && (
            <div className="flex gap-2">
              <button
                onClick={handleSendReminders}
                disabled={sending}
                className="btn btn-secondary"
              >
                <Send className="w-4 h-4" />
                {sending ? 'Sending...' : 'Send Reminders'}
              </button>
              <button onClick={openCreate} className="btn btn-primary">
                <Plus className="w-4 h-4" />
                New Notification
              </button>
            </div>
          )
        }
      />

      <div className="card">
        {loading ? (
          <Loader />
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications yet"
            description={
              canSendNotifications
                ? 'Send reminders to members or create a custom notification.'
                : 'No notifications have been sent yet.'
            }
          />
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                className="flex items-start gap-3 p-4 border border-secondary-100 rounded-lg hover:bg-secondary-50"
              >
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Bell className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-secondary-800">
                      {n.recipient?.name || 'Unknown'}
                    </p>
                    <span className={`badge ${getTypeBadge(n.type)}`}>
                      {n.type}
                    </span>
                    <span className={`badge ${getStatusBadge(n.status)}`}>
                      {n.status}
                    </span>
                    <span className="text-xs text-secondary-400 capitalize">
                      via {n.channel?.replace('_', ' ')}
                    </span>
                  </div>
                  {n.subject && (
                    <p className="text-sm font-medium text-secondary-700 mb-0.5">
                      {n.subject}
                    </p>
                  )}
                  <p className="text-sm text-secondary-600">{n.message}</p>
                  <p className="text-xs text-secondary-400 mt-1">
                    {format(new Date(n.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                {canSendNotifications && (
                  <button
                    onClick={() => handleDelete(n._id)}
                    className="p-1.5 rounded-lg hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal — only for admins/pastors/treasurers */}
      {canSendNotifications && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Send Notification"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Recipient *</label>
              <select
                className="input"
                {...register('recipient', {
                  required: 'Recipient is required',
                })}
              >
                <option value="">Select member</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} — {m.phone}
                  </option>
                ))}
              </select>
              {errors.recipient && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.recipient.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Type *</label>
                <select
                  className="input"
                  {...register('type', { required: true })}
                >
                  <option value="announcement">Announcement</option>
                  <option value="reminder">Reminder</option>
                  <option value="confirmation">Confirmation</option>
                </select>
              </div>
              <div>
                <label className="label">Channel *</label>
                <select
                  className="input"
                  {...register('channel', { required: true })}
                >
                  <option value="in_app">In-App</option>
                  <option value="sms">SMS</option>
                  <option value="email">Email</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Subject</label>
              <input
                type="text"
                className="input"
                placeholder="Optional subject"
                {...register('subject')}
              />
            </div>

            <div>
              <label className="label">Message *</label>
              <textarea
                rows="4"
                className="input"
                placeholder="Type your message..."
                {...register('message', { required: 'Message is required' })}
              />
              {errors.message && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default Notifications