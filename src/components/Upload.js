import React, { useState } from 'react';
import { pdfToText } from './utils';

function PDFUpload({ onSetup }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event) => {
    setUploading(true);
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      try {
        const text = await pdfToText(file);
        onSetup(text);
      } catch (err) {
        console.error("Error in converting PDF to text: ", err);
      }
    } else {
      console.error("Uploaded file is not a PDF");
    }
    setUploading(false);
  };

  return (
    <div className="upload">
      <label className="upload-button">
        Upload PDF
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleUpload} 
          disabled={uploading} 
          style={{display: 'none'}} 
        />
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="feather feather-file-plus"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="12" y1="18" x2="12" y2="12"></line>
          <line x1="9" y1="15" x2="15" y2="15"></line>
        </svg>
      </label>
    </div>
  );
}

export default PDFUpload;