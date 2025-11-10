import React, { useState } from 'react';
import { Cloud, AlertCircle } from 'lucide-react';

export default function DragDropZone({ onImageSelected, error }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      alert('Please upload JPG, PNG, or WebP images');
      return;
    }

    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageSelected({
        file: file,                    // ✅ IMPORTANT: Full file object
        preview: e.target.result,      // ✅ Base64 for preview
        name: file.name.split('.')[0]  // ✅ Filename
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300"
      style={{
        borderColor: isDragging ? '#FF6B35' : '#00D9FF',
        backgroundColor: isDragging ? 'rgba(255, 107, 53, 0.05)' : 'rgba(0, 217, 255, 0.02)',
        minHeight: '240px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-input"
        onChange={handleFileInput}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <label 
        htmlFor="file-input"
        className="cursor-pointer flex flex-col items-center gap-3"
      >
        <Cloud 
          size={64}
          style={{ color: isDragging ? '#FF6B35' : '#00D9FF' }}
          className="transition-colors"
        />
        <div>
          <p className="text-lg font-semibold" style={{ color: '#E8EAED' }}>
            Drag & drop images here
          </p>
          <p className="text-sm mt-1" style={{ color: '#8A8D93' }}>
            or click to browse
          </p>
        </div>
        <p className="text-xs mt-2" style={{ color: '#8A8D93' }}>
          .jpg, .png, .webp - Max 5MB
        </p>
      </label>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: '#EF4444' }}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}
    </div>
  );
}