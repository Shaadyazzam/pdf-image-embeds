
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };
  
  const validateAndProcessFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please select a valid PDF file');
      return;
    }
    
    if (file.size > 15 * 1024 * 1024) { // 15MB limit
      toast.error('File size exceeds 15MB limit');
      return;
    }
    
    onFileSelected(file);
  };
  
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className={`w-full max-w-xl mx-auto mt-6 border-2 border-dashed rounded-xl p-12
        ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}
        transition-all duration-200 ease-in-out animate-fade-up
        ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileSelector}
    >
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center
          ${isDragging ? 'bg-primary/10' : 'bg-secondary'}
          transition-colors duration-200 ease-in-out
        `}>
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
            className={`${isDragging ? 'text-primary' : 'text-muted-foreground'} transition-colors duration-200`}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        
        <div>
          <h3 className="text-lg font-medium">Upload PDF File</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Drag and drop your PDF file here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            PDF file up to 15MB
          </p>
        </div>
        
        <Button 
          variant="outline"
          size="sm"
          disabled={isProcessing}
          className="mt-2"
          onClick={(e) => {
            e.stopPropagation();
            openFileSelector();
          }}
        >
          Select File
        </Button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf"
        onChange={handleFileChange}
        disabled={isProcessing}
      />
    </div>
  );
};

export default FileUpload;
