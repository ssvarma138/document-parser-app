# Document Parser App

A Next.js app that extracts structured data from PDF purchase orders and stores it in Supabase.

## What it does

Upload a PDF purchase order → extracts key information like PO number, vendor, items, total → saves to database → displays results in a clean table.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **PDF Processing**: pdf-parse-fork
- **Deployment**: Vercel-ready

## Screenshots

![Upload Interface](screenshot-upload.png)
![Results Display](screenshot-results.png)

## Setup

1. **Clone the repo**
   ```bash
   git clone <your-repo-url>
   cd doc-parser-app
   npm install
   ```

2. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL in `supabase-setup-simple.sql` to create the table
   - Get your project URL and anon key

3. **Environment variables**
   ```bash
   # .env.local
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run locally**
   ```bash
   npm run dev
   ```

## How it works

1. **Upload**: Select a PDF file through the file input
2. **Parse**: Extracts text using pdf-parse, then uses regex patterns to find PO data
3. **Store**: Saves extracted data to Supabase database
4. **Display**: Shows results in organized cards and tables

## Database Schema

```sql
purchase_orders (
  id UUID PRIMARY KEY,
  po_number VARCHAR(100),
  vendor_name VARCHAR(255), 
  order_date DATE,
  items JSONB,
  total DECIMAL(10,2),
  parsing_error TEXT,
  original_filename VARCHAR(255),
  created_at TIMESTAMP
)
```

## Known Issues

- PDF parsing works best with standard purchase order formats
- Complex/scanned PDFs may not parse correctly
- Date parsing is basic and may miss some formats

## Future Improvements

- Better PDF parsing with OCR for scanned documents
- More robust field extraction patterns
- File upload to cloud storage
- User authentication

## Development Notes

Built as a learning project to practice:
- Next.js App Router
- Supabase integration  
- PDF processing in Node.js
- TypeScript with React
- File upload handling

---

Feel free to open issues or submit PRs if you find bugs or want to improve the parsing logic.
