import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Search, Users } from 'lucide-react'
import { useForm } from 'react-hook-form'
import PageHeader from '../components/common/PageHeader'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import Loader from '../components/common/Loader'
import memberService from '../services/memberService'
import toast from 'react-hot-toast'
import { usePermissions } from '../hooks/usePermissions'

const Members = () => {
  const { canManageMembers } = usePermissions()
  const [members, setMembers] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [search, setSearch] = useState('')
  const [filterGroup, setFilterGroup] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const fetchData = async () => {
    try {
      const params = {}
      if (search) params.search = search
      if (filterGroup) params.group = filterGroup

      const [membersRes, groupsRes] = await Promise.all([
        memberService.getAll(params),
        memberService.getGroups(),
      ])
      setMembers(membersRes.data)
      setGroups(groupsRes.data)
    } catch {
      toast.error('Failed to load members')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        setLoading(true)
        const params = {}
        if (search) params.search = search
        if (filterGroup) params.group = filterGroup

        const [membersRes, groupsRes] = await Promise.all([
          memberService.getAll(params),
          memberService.getGroups(),
        ])
        if (isMounted) {
          setMembers(membersRes.data)
          setGroups(groupsRes.data)
        }
      } catch {
        toast.error('Failed to load members')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [search, filterGroup])

  const openCreate = () => {
    if (!canManageMembers) return
    setEditing(null)
    reset({ name: '', phone: '', email: '', group: '', address: '' })
    setModalOpen(true)
  }

  const openEdit = (member) => {
    if (!canManageMembers) return
    setEditing(member)
    reset(member)
    setModalOpen(true)
  }

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await memberService.update(editing._id, data)
        toast.success('Member updated')
      } else {
        await memberService.create(data)
        toast.success('Member created')
      }
      setModalOpen(false)
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async () => {
    try {
      await memberService.delete(deleteId)
      toast.success('Member deleted')
      setDeleteId(null)
      fetchData()
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <div>
      <PageHeader
        title="Members"
        description="Manage church members and their groups"
        action={
          canManageMembers && (
            <button onClick={openCreate} className="btn btn-primary">
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          )
        }
      />

      {/* Filters */}
      <div className="card mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="input"
          >
            <option value="">All Groups</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      <div className="card">
        {loading ? (
          <Loader />
        ) : members.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No members yet"
            description={
              canManageMembers
                ? 'Add your first member to get started.'
                : 'No members have been added yet.'
            }
            action={
              canManageMembers && (
                <button onClick={openCreate} className="btn btn-primary mt-2">
                  <Plus className="w-4 h-4" />
                  Add Member
                </button>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-secondary-500 uppercase">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-secondary-500 uppercase">
                    Phone
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-secondary-500 uppercase">
                    Group
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-secondary-500 uppercase">
                    Pledged
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-secondary-500 uppercase">
                    Paid
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-secondary-500 uppercase">
                    Balance
                  </th>
                  {canManageMembers && (
                    <th className="text-right py-3 px-4 text-xs font-semibold text-secondary-500 uppercase">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member._id}
                    className="border-b border-secondary-50 hover:bg-secondary-50 transition"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-xs">
                          {member.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary-800">
                            {member.name}
                          </p>
                          <p className="text-xs text-secondary-500">
                            {member.email || 'No email'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-secondary-600">
                      {member.phone}
                    </td>
                    <td className="py-3 px-4">
                      <span className="badge badge-info">{member.group}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-secondary-700">
                      {Number(member.totalPledged).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-emerald-600">
                      {Number(member.totalPaid).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-amber-600">
                      {Number(member.balance || 0).toLocaleString()}
                    </td>
                    {canManageMembers && (
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(member)}
                            className="p-1.5 rounded-lg hover:bg-secondary-100 transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-secondary-500" />
                          </button>
                          <button
                            onClick={() => setDeleteId(member._id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal — only for admins */}
      {canManageMembers && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editing ? 'Edit Member' : 'Add Member'}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Full Name *</label>
              <input
                type="text"
                className="input"
                placeholder="John Doe"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="label">Phone *</label>
              <input
                type="tel"
                className="input"
                placeholder="+256 700 000 000"
                {...register('phone', { required: 'Phone is required' })}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="john@example.com"
                {...register('email')}
              />
            </div>

            <div>
              <label className="label">Group *</label>
              <input
                type="text"
                className="input"
                placeholder="Youth Fellowship"
                {...register('group', { required: 'Group is required' })}
              />
              {errors.group && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.group.message}
                </p>
              )}
            </div>

            <div>
              <label className="label">Address</label>
              <input
                type="text"
                className="input"
                placeholder="123 Main Street"
                {...register('address')}
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
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Member"
        message="Are you sure you want to delete this member? All associated pledges will remain but will no longer be linked to a member."
      />
    </div>
  )
}

export default Members