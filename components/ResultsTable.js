'use client'

export default function ResultsTable({ data }) {
  if (!data) return null

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
        
        {extractedData.total && (
          <div className="mt-4 bg-blue-50 p-3 rounded">
            <label className="block text-sm font-medium text-blue-600">Total Amount</label>
            <p className="text-xl font-bold text-blue-800">${extractedData.total}</p>
          </div>
        )}
      </div>

      {/* Items Table */}
      {extractedData.items && extractedData.items.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Items ({extractedData.items.length})</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Description</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Price</th>
                </tr>
              </thead>
              <tbody>
                {extractedData.items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                    <td className="border border-gray-300 px-4 py-2">${item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Error Display */}
      {extractedData.parsing_error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Parsing Error</h3>
          <p className="text-red-700">{extractedData.parsing_error}</p>
        </div>
      )}

      {/* Database Record Info */}
      {savedRecord && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Database Record</h3>
          <div className="text-sm text-green-700">
            <p><span className="font-medium">Record ID:</span> {savedRecord.id}</p>
            <p><span className="font-medium">Saved at:</span> {new Date(savedRecord.created_at).toLocaleString()}</p>
            <p><span className="font-medium">Original filename:</span> {savedRecord.original_filename}</p>
          </div>
        </div>
      )}
    </div>
  )
} 