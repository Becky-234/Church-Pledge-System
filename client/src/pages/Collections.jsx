import { useEffect, useState } from 'react'
import { Plus, Trash2, Wallet } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import PageHeader from '../components/common/PageHeader'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import Loader from '../components/common/Loader'
import collectionService from '../services/collectionService'
import pledgeService from '../services/pledgeService'
import toast from 'react-hot-toast'

const Collections = () => {
  const [collections, setCollections] = useState([])
  const [pledges, setPledges] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const fetchData = async () => {
    try {
      const [cRes, pRes] = await Promise.all([
        collectionService.getAll(),
        pledgeService.getAll(),
      ])
      setCollections(cRes.data)
      setPledges(pRes.data.filter((p) => p.status !== 'completed'))
    } catch (error) {
      toast.error('Failed to load collections')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openCreate = () => {
    reset({
      pledge: '',
      amount: '',
      paymentMethod: 'cash',
      reference: '',
      notes: '',
    })
    setModalOpen(true)
  }

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, amount: Number(data.amount) }
      await collectionService.create(payload)
      toast.success('Collection recorded')
      setModalOpen(false)
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record')
    }
  }

  const handleDelete = async () => {
    try {
      await collectionService.delete(deleteId)
      toast.success('Collection deleted')
      setDeleteId(null)
      fetchData()
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  return (
    <div>
      <PageHeader
        title="Collections"
        description="Record and manage payments received"
        action={
          <button onClick={openCreate} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Record Collection
          </button>
        }
      />

      <div className="card">
        {loading ? (
          <Loader />
        ) : collections.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="No collections yet"
            description="Record payments received from members."
            action={
              <button onClick={openCreate} className="btn btn-primary mt-2">
                <Plus className="w-4 h-4" />
                Record Collection
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-secondary-500 uppercase">Member</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-secondary-500 uppercase">Pledge Amount</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-secondary-500 uppercase">Amount Paid</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-secondary-500 uppercase">Method</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-secondary-500 uppercase">Reference</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-secondary-500 uppercase">Date</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-secondary-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {collections.map((c) => (
                  <tr key={c._id} className="border-b border-secondary-50 hover:bg-secondary-50">
                    <td className="py-3 px-4 text-sm font-medium text-secondary-800">
                      {c.member?.name || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm text-secondary-600">
                      UGX {Number(c.pledge?.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-emerald-600">
                      UGX {Number(c.amount).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="badge badge-info capitalize">
                        {c.paymentMethod?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-secondary-600">
                      {c.reference || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-secondary-600">
                      {format(new Date(c.collectedAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setDeleteId(c._id)}
                        className="p-1.5 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record Collection"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Pledge *</label>
            <select
              className="input"
              {...register('pledge', { required: 'Pledge is required' })}
            >
              <option value="">Select a pledge</option>
              {pledges.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.member?.name} — Balance: UGX {Number(p.amount - p.amountPaid).toLocaleString()}
                </option>
              ))}
            </select>
            {errors.pledge && (
              <p className="text-xs text-red-500 mt-1">{errors.pledge.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Amount (UGX) *</label>
              <input
                type="number"
                className="input"
                placeholder="50000"
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
              <label className="label">Payment Method *</label>
              <select className="input" {...register('paymentMethod', { required: true })}>
                <option value="cash">Cash</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Reference</label>
            <input
              type="text"
              className="input"
              placeholder="Transaction ID or receipt number"
              {...register('reference')}
            />
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea rows="2" className="input" {...register('notes')} />
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
              Record Collection
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Collection"
        message="This will reverse the payment. Continue?"
      />
    </div>
  )
}

export default Collections