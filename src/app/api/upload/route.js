import { NextResponse } from 'next/server'
import { extractTextFromPDF, extractPOFields } from '../../../../lib/parsePDF'
import { supabase } from '../../../../lib/supabaseClient'

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

    // Extract text from PDF
    const text = await extractTextFromPDF(buffer)
    console.log('Extracted text length:', text.length)

    // Extract structured PO fields
    const poData = extractPOFields(text)
    console.log('Extracted PO data:', poData)

    // Insert parsed data into Supabase
    const { data: insertedData, error: dbError } = await supabase
      .from('purchase_orders')
      .insert({
        po_number: poData.po_number,
        vendor_name: poData.vendor_name,
        order_date: poData.order_date,
        items: poData.items,
        total: poData.total,
        parsing_error: poData.parsing_error,
        original_filename: file.name
      })
      .select()

    if (dbError) {
      console.error('Database insertion error:', dbError)
      return NextResponse.json({ 
        message: 'PDF processed but failed to save to database',
        error: dbError.message,
        extractedData: poData
      }, { status: 500 })
    }

    console.log('Data saved to database:', insertedData)

    return NextResponse.json({ 
      message: 'PDF processed and saved successfully',
      status: 'success',
      file: {
        name: file.name,
        size: file.size,
        type: file.type
      },
      extractedData: poData,
      savedRecord: insertedData[0]
    }, { status: 200 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      message: 'Error processing file upload',
      error: error.message 
    }, { status: 500 })
  }
} 