import { useState } from 'react'
import { FileSpreadsheet, FileText, Download, ShieldAlert } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/common/EmptyState'
import reportService from '../services/reportService'
import toast from 'react-hot-toast'
import { usePermissions } from '../hooks/usePermissions'

const Reports = () => {
  const { canExportReports } = usePermissions()
  const [loadingExcel, setLoadingExcel] = useState(false)
  const [loadingPDF, setLoadingPDF] = useState(false)

  const downloadFile = (response, filename) => {
    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  const handleExcel = async () => {
    setLoadingExcel(true)
    try {
      const response = await reportService.exportExcel()
      downloadFile(response, `church-report-${Date.now()}.xlsx`)
      toast.success('Excel report downloaded')
    } catch {
      toast.error('Failed to generate Excel')
    } finally {
      setLoadingExcel(false)
    }
  }

  const handlePDF = async () => {
    setLoadingPDF(true)
    try {
      const response = await reportService.exportPDF()
      downloadFile(response, `church-report-${Date.now()}.pdf`)
      toast.success('PDF report downloaded')
    } catch {
      toast.error('Failed to generate PDF')
    } finally {
      setLoadingPDF(false)
    }
  }

  // Block members from this page
  if (!canExportReports) {
    return (
      <div>
        <PageHeader
          title="Reports & Exports"
          description="Download comprehensive reports"
        />
        <div className="card">
          <EmptyState
            icon={ShieldAlert}
            title="Access Denied"
            description="Your role does not have permission to view or export reports. Please contact an administrator."
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Reports & Exports"
        description="Download comprehensive reports of members, pledges, and collections"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Excel Card */}
        <div className="card">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <FileSpreadsheet className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">
                Excel Report (.xlsx)
              </h3>
              <p className="text-sm text-secondary-500">
                Full data export with 3 sheets: Members, Pledges, and Collections.
                Perfect for spreadsheets and analysis.
              </p>
            </div>
          </div>
          <button
            onClick={handleExcel}
            disabled={loadingExcel}
            className="btn btn-success w-full"
          >
            <Download className="w-4 h-4" />
            {loadingExcel ? 'Generating...' : 'Download Excel Report'}
          </button>
        </div>

        {/* PDF Card */}
        <div className="card">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <FileText className="w-7 h-7 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">
                PDF Report (.pdf)
              </h3>
              <p className="text-sm text-secondary-500">
                Summary report with total pledges, collections, and member list.
                Ideal for printing and sharing.
              </p>
            </div>
          </div>
          <button
            onClick={handlePDF}
            disabled={loadingPDF}
            className="btn btn-danger w-full"
          >
            <Download className="w-4 h-4" />
            {loadingPDF ? 'Generating...' : 'Download PDF Report'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="card mt-6 bg-blue-50 border-blue-100">
        <h3 className="font-semibold text-blue-900 mb-2">Report Contents</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc pl-5">
          <li>
            <strong>Excel:</strong> Member details, pledge statuses, collection
            history, and payment methods
          </li>
          <li>
            <strong>PDF:</strong> Executive summary, total pledged, total
            collected, balance, and member overview
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Reports