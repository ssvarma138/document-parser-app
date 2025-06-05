'use client'

import { useState } from 'react'
import FileUpload from '../../components/FileUpload'
import ResultsTable from '../../components/ResultsTable'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadResult, setUploadResult] = useState(null)

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    // Clear previous results when new file is selected
    setUploadResult(null)
  }

  const handleUploadComplete = (result) => {
    setUploadResult(result)
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Document Parser App
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Upload PDF Purchase Orders to extract structured information
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
        {uploadResult && uploadResult.status === 'success' && (
          <ResultsTable data={uploadResult} />
        )}
      </div>
    </div>
  );
}
