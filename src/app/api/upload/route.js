import { NextResponse } from 'next/server'
import formidable from 'formidable'
import fs from 'fs'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    
    if (!file) {
      return NextResponse.json({ 
        message: 'No file uploaded',
        error: 'Missing file' 
      }, { status: 400 })
    }

    // Check if it's a PDF
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ 
        message: 'Invalid file type. Please upload a PDF.',
        error: 'Invalid file type' 
      }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    console.log('PDF file received:', {
      name: file.name,
      size: file.size,
      type: file.type,
      bufferLength: buffer.length
    })

    return NextResponse.json({ 
      message: 'PDF file received successfully',
      status: 'success',
      file: {
        name: file.name,
        size: file.size,
        type: file.type
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      message: 'Error processing file upload',
      error: error.message 
    }, { status: 500 })
  }
} 