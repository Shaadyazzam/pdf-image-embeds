
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  
  const copyAllImages = () => {
    navigator.clipboard.writeText(images.join('\n\n'))
      .then(() => {
        toast.success('All images copied to clipboard');
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
      
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="preview">Image Preview</TabsTrigger>
          <TabsTrigger value="html">HTML Embed Code</TabsTrigger>
        </TabsList>
        
        <Separator className="my-6" />
        
        <TabsContent value="preview">
          <ImagePreview images={images} onCopyAll={copyAllImages} />
        </TabsContent>
        
        <TabsContent value="html" className="animate-fade-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium">HTML for Email</h3>
            <Button variant="default" onClick={copyHtml}>
              Copy HTML
            </Button>
          </div>
          
          <div className="mt-4 p-4 rounded-lg border bg-card overflow-hidden">
            <pre className="max-h-96 overflow-y-auto text-sm text-muted-foreground font-mono whitespace-pre-wrap">
              {htmlOutput}
            </pre>
          </div>
          
          <div className="mt-6 p-4 rounded-lg border bg-secondary/50">
            <h4 className="text-sm font-medium mb-2">How to use:</h4>
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
              <li>Copy the HTML code above</li>
              <li>Paste it into your email composer in HTML mode</li>
              <li>Images will be directly embedded in your email</li>
              <li>No need to attach files or host images separately</li>
            </ol>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConversionResult;
