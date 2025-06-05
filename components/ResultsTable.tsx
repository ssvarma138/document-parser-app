'use client'

interface UploadResult {
  message: string
  extractedData?: {
    po_number: string | null
    vendor_name: string | null
    order_date: string | null
    items: Array<{
      quantity: number
      description: string
      price: number
    }>
    total: number | null
    parsing_error: string | null
  }
  savedRecord?: {
    id: string
    original_filename: string
    created_at: string
  }
  error?: string
}

interface ResultsTableProps {
  data: UploadResult | null
}

export default function ResultsTable({ data }: ResultsTableProps) {
  if (!data || !data.extractedData || !data.savedRecord) return null

  const { extractedData, savedRecord } = data

  return (
    <div className="mt-8 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Parsed Purchase Order Data</h2>
      
      {/* Summary Information */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Purchase Order Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-medium text-gray-600">PO Number</label>
            <p className="text-lg font-semibold text-gray-800">{extractedData.po_number || 'Not found'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-medium text-gray-600">Vendor Name</label>
            <p className="text-lg font-semibold text-gray-800">{extractedData.vendor_name || 'Not found'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-medium text-gray-600">Order Date</label>
            <p className="text-lg font-semibold text-gray-800">{extractedData.order_date || 'Not found'}</p>
          </div>
        </div>
        
        {/* Total Amount */}
        <div className="mt-4 bg-blue-50 p-3 rounded">
          <label className="block text-sm font-medium text-blue-600">Total Amount</label>
          <p className="text-xl font-bold text-blue-800">
            {extractedData.total ? `$${extractedData.total.toFixed(2)}` : 'Not found'}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Items</h3>
        {extractedData.items && extractedData.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Quantity</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Description</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Price</th>
                </tr>
              </thead>
              <tbody>
                {extractedData.items.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-800">{item.quantity}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{item.description}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {item.price ? `$${item.price.toFixed(2)}` : '$0.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No items found in the purchase order.</p>
        )}
      </div>

      {/* Database Record Info */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Database Record</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-medium text-gray-600">Record ID</label>
            <p className="text-sm font-mono text-gray-800">{savedRecord.id}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-medium text-gray-600">File Name</label>
            <p className="text-sm text-gray-800">{savedRecord.original_filename}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-medium text-gray-600">Created</label>
            <p className="text-sm text-gray-800">
              {new Date(savedRecord.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Parsing Error */}
      {extractedData.parsing_error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2 text-yellow-800">Parsing Notice</h3>
          <p className="text-sm text-yellow-700">{extractedData.parsing_error}</p>
        </div>
      )}
    </div>
  )
} 