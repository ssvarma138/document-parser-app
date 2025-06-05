'use client'

import { useState, ChangeEvent } from 'react'

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

interface FileUploadProps {
  onFileSelect?: (file: File | null) => void
  onUploadComplete?: (result: UploadResult) => void
}

export default function FileUpload({ onFileSelect, onUploadComplete }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setSelectedFile(file)
    setUploadResult(null) // Clear previous results
    
    // Pass the file to parent component if callback provided
    if (onFileSelect) {
      onFileSelect(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setUploadResult(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setUploadResult(result)
        // Pass the complete result to parent component
        if (onUploadComplete) {
          onUploadComplete(result)
        }
      } else {
        setUploadResult({
          message: result.message || 'Upload failed',
          error: result.error || 'Unknown error'
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadResult({
        message: 'Network error during upload',
        error: 'Network error'
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload PDF Document</h2>
      
      {/* File Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select PDF File
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Selected File Info */}
      {selectedFile && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Selected:</strong> {selectedFile.name}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          !selectedFile || uploading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {uploading ? 'Processing PDF...' : 'Upload and Parse'}
      </button>

      {/* Upload Result */}
      {uploadResult && (
        <div className={`mt-6 p-4 rounded-lg ${
          uploadResult.error 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-green-50 border border-green-200'
        }`}>
          <p className={`text-sm ${
            uploadResult.error ? 'text-red-700' : 'text-green-700'
          }`}>
            {uploadResult.message}
          </p>
          {uploadResult.error && (
            <p className="text-xs text-red-600 mt-1">
              Error: {uploadResult.error}
            </p>
          )}
        </div>
      )}
    </div>
  )
} 