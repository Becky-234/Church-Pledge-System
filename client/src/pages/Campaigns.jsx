import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Megaphone, Target } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import PageHeader from '../components/common/PageHeader'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import Loader from '../components/common/Loader'
import campaignService from '../services/campaignService'
import toast from 'react-hot-toast'
import { usePermissions } from '../hooks/usePermissions'

const Campaigns = () => {
  const { canManageCampaigns } = usePermissions()
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const fetchCampaigns = async () => {
    try {
      const res = await campaignService.getAll()
      setCampaigns(res.data)
    } catch (error) {
      toast.error('Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const openCreate = () => {
    if (!canManageCampaigns) return
    setEditing(null)
    reset({
      title: '',
      description: '',
      targetAmount: '',
      startDate: '',
      endDate: '',
      status: 'active',
    })
    setModalOpen(true)
  }

  const openEdit = (c) => {
    if (!canManageCampaigns) return
    setEditing(c)
    reset({
      ...c,
      startDate: c.startDate?.split('T')[0],
      endDate: c.endDate?.split('T')[0],
    })
    setModalOpen(true)
  }

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await campaignService.update(editing._id, data)
        toast.success('Campaign updated')
      } else {
        await campaignService.create(data)
        toast.success('Campaign created')
      }
      setModalOpen(false)
      fetchCampaigns()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async () => {
    try {
      await campaignService.delete(deleteId)
      toast.success('Campaign deleted')
      setDeleteId(null)
      fetchCampaigns()
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  const getStatusBadge = (status) => {
    const map = {
      active: 'badge-success',
      completed: 'badge-info',
      cancelled: 'badge-danger',
    }
    return map[status] || 'badge-secondary'
  }

  return (
    <div>
      <PageHeader
        title="Campaigns"
        description="Manage pledge campaigns and fundraising goals"
        action={
          canManageCampaigns && (
            <button onClick={openCreate} className="btn btn-primary">
              <Plus className="w-4 h-4" />
              New Campaign
            </button>
          )
        }
      />

      {loading ? (
        <Loader />
      ) : campaigns.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Megaphone}
            title="No campaigns yet"
            description={
              canManageCampaigns
                ? 'Create your first pledge campaign to get started.'
                : 'No campaigns have been created yet.'
            }
            action={
              canManageCampaigns && (
                <button onClick={openCreate} className="btn btn-primary mt-2">
                  <Plus className="w-4 h-4" />
                  Create Campaign
                </button>
              )
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((c) => {
            const progress =
              c.targetAmount > 0
                ? Math.min(
                    100,
                    Math.round((c.totalCollected / c.targetAmount) * 100)
                  )
                : 0

            return (
              <div key={c._id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <Target className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className={`badge ${getStatusBadge(c.status)}`}>
                    {c.status}
                  </span>
                </div>

                <h3 className="font-semibold text-secondary-800 mb-1">
                  {c.title}
                </h3>
                <p className="text-xs text-secondary-500 mb-4 line-clamp-2">
                  {c.description || 'No description'}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-secondary-500">Target</span>
                    <span className="font-medium text-secondary-700">
                      UGX {Number(c.targetAmount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-secondary-500">Collected</span>
                    <span className="font-medium text-emerald-600">
                      UGX {Number(c.totalCollected).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-secondary-500">Pledged</span>
                    <span className="font-medium text-amber-600">
                      UGX {Number(c.totalPledged).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-secondary-500">Progress</span>
                    <span className="font-medium text-secondary-700">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary-100 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-secondary-100">
                  <span className="text-xs text-secondary-500">
                    Ends{' '}
                    {c.endDate
                      ? format(new Date(c.endDate), 'MMM dd, yyyy')
                      : 'N/A'}
                  </span>

                  {/* Only show edit/delete for admins */}
                  {canManageCampaigns && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(c)}
                        className="p-1.5 rounded-lg hover:bg-secondary-100"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-secondary-500" />
                      </button>
                      <button
                        onClick={() => setDeleteId(c._id)}
                        className="p-1.5 rounded-lg hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal - Only render if user can manage */}
      {canManageCampaigns && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editing ? 'Edit Campaign' : 'Create Campaign'}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Campaign Title *</label>
              <input
                type="text"
                className="input"
                placeholder="New Church Building"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                rows="3"
                className="input"
                placeholder="Describe the campaign purpose..."
                {...register('description')}
              />
            </div>

            <div>
              <label className="label">Target Amount (UGX) *</label>
              <input
                type="number"
                className="input"
                placeholder="1000000"
                {...register('targetAmount', {
                  required: 'Target amount is required',
                  min: { value: 1, message: 'Must be greater than 0' },
                })}
              />
              {errors.targetAmount && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.targetAmount.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Start Date *</label>
                <input
                  type="date"
                  className="input"
                  {...register('startDate', {
                    required: 'Start date is required',
                  })}
                />
                {errors.startDate && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div>
                <label className="label">End Date *</label>
                <input
                  type="date"
                  className="input"
                  {...register('endDate', {
                    required: 'End date is required',
                  })}
                />
                {errors.endDate && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            {editing && (
              <div>
                <label className="label">Status</label>
                <select className="input" {...register('status')}>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Campaign"
        message="Are you sure? All associated pledges will remain but the campaign will be removed."
      />
    </div>
  )
}

export default Campaigns