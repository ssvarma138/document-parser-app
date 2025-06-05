export async function extractTextFromPDF(buffer) {
  try {
    // Dynamic import to avoid issues during build
    const pdfParse = await import('pdf-parse-fork')
    const data = await pdfParse.default(buffer)
    return data.text
  } catch (error) {
    console.error('Error parsing PDF:', error)
    // Return a fallback message instead of throwing error
    return `[PDF parsing failed: ${error.message}. Please try a different PDF file or check if the file is valid.]`
  }
}

export function extractPOFields(text) {
  try {
    // If PDF parsing failed, return empty fields but don't crash
    if (text.includes('[PDF parsing failed:')) {
      return {
        po_number: null,
        vendor_name: null,
        order_date: null,
        items: null,
        total: null,
        parsing_error: text
      }
    }

    // Extract PO Number - look for patterns like "PO#", "P.O.", "Purchase Order"
    const poNumberMatch = text.match(/(?:PO#?|P\.O\.?|Purchase Order#?)[:\s]*([A-Z0-9-]+)/i)
    const po_number = poNumberMatch ? poNumberMatch[1] : null

    // Extract Vendor Name - look for patterns like "Vendor:", "Supplier:", "From:"
    const vendorMatch = text.match(/(?:Vendor|Supplier|From|Bill To)[:\s]*([^\n\r]+)/i)
    const vendor_name = vendorMatch ? vendorMatch[1].trim() : null

    // Extract Order Date - look for date patterns
    const dateMatch = text.match(/(?:Date|Order Date|PO Date)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i)
    const order_date = dateMatch ? dateMatch[1] : null

    // Extract Total - look for patterns like "Total:", "Amount:", "$"
    const totalMatch = text.match(/(?:Total|Amount|Grand Total)[:\s]*\$?([0-9,]+\.?\d{0,2})/i)
    const total = totalMatch ? parseFloat(totalMatch[1].replace(/,/g, '')) : null

    // Extract line items - this is a simplified approach
    const items = extractLineItems(text)

    return {
      po_number,
      vendor_name,
      order_date,
      items,
      total,
      parsing_error: null
    }
  } catch (error) {
    console.error('Error extracting PO fields:', error)
    return {
      po_number: null,
      vendor_name: null,
      order_date: null,
      items: null,
      total: null,
      parsing_error: `Field extraction failed: ${error.message}`
    }
  }
}

function extractLineItems(text) {
  try {
    // Look for patterns that might be line items
    // This is a simplified regex - real-world parsing would be more complex
    const lines = text.split('\n')
    const items = []
    
    for (const line of lines) {
      // Look for lines with quantity, description, and price patterns
      const itemMatch = line.match(/(\d+)\s+(.+?)\s+\$?(\d+\.?\d{0,2})/i)
      if (itemMatch) {
        items.push({
          quantity: parseInt(itemMatch[1]),
          description: itemMatch[2].trim(),
          price: parseFloat(itemMatch[3])
        })
      }
    }
    
    return items.length > 0 ? items : null
  } catch (error) {
    console.error('Error extracting line items:', error)
    return null
  }
} 