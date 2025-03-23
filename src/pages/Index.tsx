
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import ConversionResult from '@/components/ConversionResult';
import { convertPdfToBase64Images } from '@/utils/pdfUtils';

const Index: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [base64Images, setBase64Images] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleFileSelected = async (file: File) => {
    try {
      setSelectedFile(file);
      setIsProcessing(true);
      setProgress(0);
      setIsCompleted(false);
      
      toast.info(`Processing "${file.name}"`, {
        description: 'Please wait while we convert your PDF to images...'
      });
      
      // Convert PDF to base64 images with progress tracking
      const images = await convertPdfToBase64Images(file, setProgress);
      
      if (images.length === 0) {
        toast.error('No pages could be converted');
        reset();
        return;
      }
      
      setBase64Images(images);
      setIsCompleted(true);
      
      toast.success(`Conversion complete! ${images.length} ${images.length === 1 ? 'page' : 'pages'} converted`, {
        description: 'You can now copy the images or HTML for email embedding'
      });
      
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process PDF file');
      reset();
    } finally {
      setIsProcessing(false);
    }
  };
  
  const reset = () => {
    setSelectedFile(null);
    setIsProcessing(false);
    setProgress(0);
    setIsCompleted(false);
    setBase64Images([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {!isCompleted ? (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 space-y-3 animate-fade-up" style={{ animationDelay: '100ms' }}>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                PDF to Embedded Images
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Convert PDF pages to base64 images for direct embedding in emails and documents.
              </p>
            </div>
            
            <FileUpload 
              onFileSelected={handleFileSelected}
              isProcessing={isProcessing}
            />
            
            {isProcessing && (
              <div className="mt-8 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Converting {selectedFile?.name}...
                  </span>
                  <span className="text-sm font-medium">
                    {Math.round(progress * 100)}%
                  </span>
                </div>
                
                <Progress value={progress * 100} className="h-2" />
                
                <div className="flex justify-center mt-6">
                  <div className="loader h-8 w-8 rounded-full border-2 border-primary border-t-transparent" />
                </div>
              </div>
            )}
            
            <div className="rounded-lg border p-6 mt-12 bg-card animate-fade-up" style={{ animationDelay: '200ms' }}>
              <h3 className="text-lg font-medium mb-2">How it works</h3>
              
              <ol className="mt-4 space-y-4">
                <li className="flex gap-3">
                  <div className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                    1
                  </div>
                  <p className="text-muted-foreground text-sm">
                    <span className="font-medium text-foreground">Upload a PDF file</span> — Select or drag a PDF file to begin the conversion process.
                  </p>
                </li>
                
                <li className="flex gap-3">
                  <div className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                    2
                  </div>
                  <p className="text-muted-foreground text-sm">
                    <span className="font-medium text-foreground">Convert to images</span> — Each page is converted to a high-quality PNG image.
                  </p>
                </li>
                
                <li className="flex gap-3">
                  <div className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                    3
                  </div>
                  <p className="text-muted-foreground text-sm">
                    <span className="font-medium text-foreground">Embed in emails</span> — Copy the base64 encoded images or HTML to paste into emails.
                  </p>
                </li>
              </ol>
              
              <div className="mt-6 flex items-center justify-between pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  All processing happens in your browser. Files are not uploaded to any server.
                </p>
                
                <Button variant="ghost" size="sm" asChild>
                  <a 
                    href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs"
                  >
                    Learn more about base64 encoding
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <ConversionResult 
            images={base64Images}
            onReset={reset}
          />
        )}
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built with modern web technologies. All processing happens in your browser.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
