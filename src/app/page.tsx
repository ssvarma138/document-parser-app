'use client'

import { useState } from 'react'
import FileUpload from '../../components/FileUpload'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileSelect = (file) => {
    setSelectedFile(file)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Document Parser App
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Upload PDF documents to extract structured information
        </p>
        
        <FileUpload onFileSelect={handleFileSelect} />
        
        {selectedFile && (
          <div className="mt-8 max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-2">File Ready for Processing:</h2>
            <p className="text-gray-700">{selectedFile.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
