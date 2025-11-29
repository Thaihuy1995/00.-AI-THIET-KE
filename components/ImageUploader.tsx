import React, { useRef, useState } from 'react';

interface Props {
  label: string;
  preview: string | null;
  onUpload: (file: File) => void;
  onClear: () => void;
  heightClass?: string;
  required?: boolean;
}

const ImageUploader: React.FC<Props> = ({ label, preview, onUpload, onClear, heightClass = "h-32", required = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onUpload(file);
      } else {
        alert("Vui lòng chỉ thả file ảnh.");
      }
    }
  };

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-semibold text-tp-text uppercase tracking-wider">
          {label} {required && <span className="text-tp-accent">*</span>}
        </label>
        {preview && (
          <button onClick={(e) => { e.stopPropagation(); onClear(); }} className="text-xs text-tp-accent hover:text-white">
            Xóa
          </button>
        )}
      </div>
      
      <div 
        className={`relative border border-dashed transition-all rounded-lg overflow-hidden flex flex-col items-center justify-center cursor-pointer ${heightClass} 
          ${isDragging 
            ? 'border-tp-accent bg-tp-accent/10 scale-[1.02]' 
            : 'border-tp-border bg-tp-dark/50 hover:bg-tp-border/20'
          }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-contain pointer-events-none" />
        ) : (
          <div className="text-center p-4 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 mx-auto mb-2 transition-colors ${isDragging ? 'text-tp-accent' : 'text-tp-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={`text-xs block ${isDragging ? 'text-tp-accent font-bold' : 'text-tp-muted'}`}>
              {isDragging ? 'Thả Ảnh Vào Đây' : 'Nhấn hoặc Kéo Thả ảnh'}
            </span>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />
      </div>
    </div>
  );
};

export default ImageUploader;