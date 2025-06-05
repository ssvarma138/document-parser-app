'use client'

import { useState } from 'react'

export default function FileUpload({ onFileSelect, onUploadComplete }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
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
      setUploadResult(result)
      
      // Pass the complete result back to parent component
      if (onUploadComplete) {
        onUploadComplete(result)
      }
    } catch (error) {
      const errorResult = {
        status: 'error',
        message: 'Upload failed: ' + error.message
      }
      setUploadResult(errorResult)
      
      // Pass error result to parent too
      if (onUploadComplete) {
        onUploadComplete(errorResult)
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white shadow-lg">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
        />
        
        {selectedFile && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-700">
              <span className="font-medium">Selected:</span> {selectedFile.name}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploading ? 'Processing...' : 'Upload & Process PDF'}
            </button>
          </div>
        )}

        {uploadResult && (
          <div className={`mt-4 p-3 rounded ${
            uploadResult.status === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${
              uploadResult.status === 'success' ? 'text-green-700' : 'text-red-700'
            }`}>
              {uploadResult.message}
            </p>
            {uploadResult.status === 'success' && (
              <p className="text-xs text-green-600 mt-1">
                ✓ Data saved to database. See results below.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 