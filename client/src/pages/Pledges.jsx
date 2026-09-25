import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, HandCoins, Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import PageHeader from '../components/common/PageHeader'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import Loader from '../components/common/Loader'
import pledgeService from '../services/pledgeService'
import memberService from '../services/memberService'
import campaignService from '../services/campaignService'
import toast from 'react-hot-toast'

const Pledges = () => {
  const [pledges, setPledges] = useState([])
  const [members, setMembers] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const fetchData = async () => {
    try {
      const params = filterStatus ? { status: filterStatus } : {}
      const [pRes, mRes, cRes] = await Promise.all([
        pledgeService.getAll(params),
        memberService.getAll(),
        campaignService.getAll(),
      ])
      setPledges(pRes.data)
      setMembers(mRes.data)
      setCampaigns(cRes.data)
    } catch (error) {
      toast.error('Failed to load pledges')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [filterStatus])

  const openCreate = () => {
    setEditing(null)
    reset({
      member: '',
      campaign: '',
      amount: '',
      dueDate: '',
      description: '',
    })
    setModalOpen(true)
  }

  const openEdit = (pledge) => {
    setEditing(pledge)
    reset({
      ...pledge,
      member: pledge.member?._id || pledge.member,
      campaign: pledge.campaign?._id || pledge.campaign,
      dueDate: pledge.dueDate?.split('T')[0],
    })
    setModalOpen(true)
  }

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        amount: Number(data.amount),
      }
      if (editing) {
        await pledgeService.update(editing._id, payload)
        toast.success('Pledge updated')
      } else {
        await pledgeService.create(payload)
        toast.success('Pledge created')
      }
      setModalOpen(false)
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async () => {
    try {
      await pledgeService.delete(deleteId)
      toast.success('Pledge deleted')
      setDeleteId(null)
      fetchData()
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  const getStatusBadge = (status) => {
    const map = {
      pending: 'badge-warning',
      partial: 'badge-info',
      completed: 'badge-success',
      overdue: 'badge-danger',
    }
    return map[status] || 'badge-secondary'
  }

  return (
    <div>
      <PageHeader
        title="Pledges"
        description="Track member pledge commitments"
        action={
          <button onClick={openCreate} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            New Pledge
          </button>
        }
      />

      {/* Filter */}
      <div className="card mb-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input max-w-xs"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="partial">Partial</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div className="card">
        {loading ? (
          <Loader />
        ) : pledges.length === 0 ? (
          <EmptyState
            icon={HandCoins}
            title="No pledges yet"
            description="Assign pledges to members to start tracking."
            action={
              <button onClick={openCreate} className="btn btn-primary mt-2">
                <Plus className="w-4 h-4" />
                Create Pledge
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-secondary-500 uppercase">Member</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-secondary-500 uppercase">Campaign</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-secondary-500 uppercase">Amount</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-secondary-500 uppercase">Paid</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-secondary-500 uppercase">Balance</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-secondary-500 uppercase">Due</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-secondary-500 uppercase">Status</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-secondary-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pledges.map((p) => (
                  <tr key={p._id} className="border-b border-secondary-50 hover:bg-secondary-50">
                    <td className="py-3 px-4 text-sm font-medium text-secondary-800">
                      {p.member?.name || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm text-secondary-600">
                      {p.campaign?.title || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-secondary-700">
                      {Number(p.amount).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-emerald-600">
                      {Number(p.amountPaid).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-amber-600">
                      {Number(p.amount - p.amountPaid).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-secondary-600">
                      {format(new Date(p.dueDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${getStatusBadge(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-secondary-100">
                          <Edit2 className="w-4 h-4 text-secondary-500" />
                        </button>
                        <button onClick={() => setDeleteId(p._id)} className="p-1.5 rounded-lg hover:bg-red-50">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Pledge' : 'New Pledge'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Member *</label>
              <select
                className="input"
                {...register('member', { required: 'Member is required' })}
              >
                <option value="">Select member</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
              {errors.member && (
                <p className="text-xs text-red-500 mt-1">{errors.member.message}</p>
              )}
            </div>

            <div>
              <label className="label">Campaign *</label>
              <select
                className="input"
                {...register('campaign', { required: 'Campaign is required' })}
              >
                <option value="">Select campaign</option>
                {campaigns.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>
              {errors.campaign && (
                <p className="text-xs text-red-500 mt-1">{errors.campaign.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Amount (UGX) *</label>
              <input
                type="number"
                className="input"
                placeholder="100000"
                {...register('amount', {
                  required: 'Amount is required',
                  min: { value: 1, message: 'Must be > 0' },
                })}
              />
              {errors.amount && (
                <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label className="label">Due Date *</label>
              <input
                type="date"
                className="input"
                {...register('dueDate', { required: 'Due date is required' })}
              />
              {errors.dueDate && (
                <p className="text-xs text-red-500 mt-1">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              rows="3"
              className="input"
              placeholder="Additional notes..."
              {...register('description')}
            />
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
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Pledge"
        message="Are you sure you want to delete this pledge?"
      />
    </div>
  )
}

export default Pledges