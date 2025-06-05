'use client'

import { useState } from 'react'
import FileUpload from '../../components/FileUpload'
import ResultsTable from '../../components/ResultsTable'

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

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file)
    // Clear previous results when new file is selected
    setUploadResult(null)
  }

  const handleUploadComplete = (result: UploadResult) => {
    setUploadResult(result)
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Document Parser App
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Upload a PDF Purchase Order to extract and display structured data
        </p>
        
        <FileUpload 
          onFileSelect={handleFileSelect}
          onUploadComplete={handleUploadComplete}
        />
        
        {selectedFile && !uploadResult && (
          <div className="mt-8 max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-2">File Ready for Processing:</h2>
            <p className="text-gray-700">{selectedFile.name}</p>
          </div>
        )}

        {/* Display results table when upload is successful */}
        {uploadResult && (
          <ResultsTable data={uploadResult} />
        )}
      </div>
    </div>
  );
}
