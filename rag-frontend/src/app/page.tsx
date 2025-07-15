'use client';

import React, { useRef, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';

export default function HomePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pythonCode, setPythonCode] = useState<string>('# Python formulas will appear here\n');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // 1. Prepare the form data
      const formData = new FormData();
      formData.append('file', file);

      // 2. Send the file to FastAPI
      const response = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData,
      });

      // 3. Parse the response
      const data = await response.json();
      console.log(data); // <-- Add this

      // 4. Use the result (e.g., update your code editor)
      if (data.code) {
        setPythonCode(data.code);
      } else {
        setPythonCode('# Error processing file');
      }
    }
  };

  return (
    <main style={{ height: '100vh', width: '100vw', background: '#fff', color: '#181818', fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', height: '100%', width: '100%' }}>
        {/* Left side: Upload UI */}
        <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#fff' }}>
          <h1 style={{ color: '#181818' }}>Upload PDF and Extract Formulas</h1>
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ marginBottom: 24 }}
          />
        </div>
        {/* Right side: Monaco Editor */}
        <div style={{ flex: 1, background: '#fff', color: '#181818', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch', borderLeft: '1px solid #eee', padding: 32 }}>
          <h2 style={{ color: '#181818', marginBottom: 16 }}>Python Code</h2>
          <div style={{ flex: 1, minHeight: 0 }}>
            <MonacoEditor
              height="60vh"
              language="python"
              value={pythonCode}
              options={{
                readOnly: false,
                minimap: { enabled: false },
                fontSize: 16,
                theme: 'vs-light', // white background
              }}
              onChange={(value) => setPythonCode(value || '')}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
