
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImagePreviewProps {
  images: string[];
  onCopyAll: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ images, onCopyAll }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const copyImage = (base64: string, index: number) => {
    navigator.clipboard.writeText(base64)
      .then(() => {
        toast.success(`Copied image ${index + 1} to clipboard`);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy to clipboard');
      });
  };

  return (
    <div className="w-full animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Preview ({images.length} {images.length === 1 ? 'image' : 'images'})</h2>
        <Button variant="default" onClick={onCopyAll}>
          Copy All Images
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {images.map((base64, index) => (
          <div 
            key={index}
            className={`
              relative overflow-hidden rounded-lg border border-border transition-all duration-200
              ${selectedIndex === index ? 'ring-2 ring-primary ring-offset-2' : 'hover:shadow-md'}
            `}
            onClick={() => setSelectedIndex(index)}
          >
            <div className="aspect-[4/3] overflow-hidden bg-secondary/50">
              <img 
                src={base64} 
                alt={`Page ${index + 1}`} 
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="absolute top-2 right-2 flex space-x-1">
              <div className="bg-background/90 backdrop-blur-sm text-xs px-2 py-1 rounded-md shadow-sm">
                Page {index + 1}
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
              <Button 
                variant="secondary" 
                size="sm"
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  copyImage(base64, index);
                }}
              >
                Copy Image
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {selectedIndex !== null && (
        <div className="mt-8 p-6 border rounded-lg bg-card animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Image {selectedIndex + 1}</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyImage(images[selectedIndex], selectedIndex)}
            >
              Copy
            </Button>
          </div>
          <div className="p-4 bg-background rounded-md overflow-x-auto">
            <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap break-all">
              {images[selectedIndex]}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
