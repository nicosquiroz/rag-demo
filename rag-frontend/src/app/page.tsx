'use client';

import React, { useRef, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import IndexList from './components/indexlist';

export default function HomePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pythonCode, setPythonCode] = useState<string>('# Python formulas will appear here\n');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedIndexId, setSelectedIndexId] = useState<string | null>(null);

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
    <main className="flex h-screen bg-gray-50 text-black font-sans">
      {/* Sidebar */}
      <aside className="w-72 min-w-[220px] h-full bg-gray-50 border-r border-gray-200 flex flex-col py-6 px-4">
        <div className="flex items-center gap-2 mb-8">
          {/* Replace with your logo if needed */}
          {/* <span className="w-7 h-7 bg-black rounded-full flex items-center justify-center text-white font-bold">A</span> */}
          <span className="ml-5 font-bold text-lg tracking-tight text-gray-900">Rulebook</span>
        </div>
        <br></br>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Índices</h2>
        <IndexList
          selectedId={selectedIndexId}
          onSelect={setSelectedIndexId}
        />
      </aside>
      {/* Main Content */}
      <section style={{ flex: 1, display: 'flex', height: '100%' }}>
        
        {/* Upload and Editor */}
        <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#fff' }}>
        <div className='bg-black text-white ml-10'> hi</div>
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
                theme: 'vs-light',
              }}
              onChange={(value) => setPythonCode(value || '')}
            />
          </div>
        </div>
      </section>
        {/* Right panel placeholder for future use */}
        {/* <aside className="w-56 min-w-[160px] border-l pl-4 bg-white/90 shadow-md rounded-l-3xl flex flex-col items-start py-8 px-6"></aside> */}
    </main>
  );
}
