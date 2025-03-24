
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import ImagePreview from './ImagePreview';

interface ConversionResultProps {
  images: string[];
  onReset: () => void;
}

const ConversionResult: React.FC<ConversionResultProps> = ({ images, onReset }) => {
  // Generate HTML that would be used in an email composer
  const generateHtmlOutput = () => {
    return images.map((base64, index) => 
      `<div style="margin-bottom: 20px;"><img src="${base64}" alt="Page ${index + 1}" style="max-width: 100%;" /></div>`
    ).join('\n');
  };
  
  const generateSingleImageHtml = (base64: string, index: number) => {
    return `<div style="margin-bottom: 20px;"><img src="${base64}" alt="Page ${index + 1}" style="max-width: 100%;" /></div>`;
  };
  
  const htmlOutput = generateHtmlOutput();
  
  const copyHtml = () => {
    navigator.clipboard.writeText(htmlOutput)
      .then(() => {
        toast.success('HTML copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy to clipboard');
      });
  };
  
  return (
    <div className="w-full max-w-5xl mx-auto mt-8 animate-fade-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-medium">Conversion Results</h2>
        <Button variant="outline" onClick={onReset}>
          Convert Another PDF
        </Button>
      </div>
      
      {/* Image Preview Section with Copy HTML Button */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium">Preview ({images.length} {images.length === 1 ? 'image' : 'images'})</h2>
          <Button variant="default" onClick={copyHtml}>
            Copy HTML
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {images.map((base64, index) => (
            <div 
              key={index}
              className="relative overflow-hidden rounded-lg border border-border transition-all duration-200 hover:shadow-md"
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
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(base64)
                        .then(() => {
                          toast.success(`Copied image ${index + 1} to clipboard`);
                        })
                        .catch((err) => {
                          console.error('Failed to copy: ', err);
                          toast.error('Failed to copy to clipboard');
                        });
                    }}
                  >
                    Copy Image
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      const singleHtml = generateSingleImageHtml(base64, index);
                      navigator.clipboard.writeText(singleHtml)
                        .then(() => {
                          toast.success(`Copied HTML for image ${index + 1}`);
                        })
                        .catch((err) => {
                          console.error('Failed to copy: ', err);
                          toast.error('Failed to copy HTML');
                        });
                    }}
                  >
                    Copy HTML
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 p-4 rounded-lg border bg-secondary/50">
        <h4 className="text-sm font-medium mb-2">How to use:</h4>
        <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
          <li>Copy the HTML code using the "Copy HTML" button</li>
          <li>Paste it into your email composer in HTML mode</li>
          <li>Images will be directly embedded in your email</li>
          <li>No need to attach files or host images separately</li>
        </ol>
      </div>
    </div>
  );
};

export default ConversionResult;
