
import * as pdfjsLib from 'pdfjs-dist';
import { toast } from "sonner";
import { PDFWorker } from 'pdfjs-dist/build/pdf.worker.mjs';

// Configure the worker source with a bundled worker approach
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

// Convert a PDF file to an array of base64 image strings
export const convertPdfToBase64Images = async (
  file: File, 
  progressCallback?: (progress: number) => void
): Promise<string[]> => {
  try {
    // Read the file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument(arrayBuffer);
    const pdf = await loadingTask.promise;
    
    const totalPages = pdf.numPages;
    const base64Images: string[] = [];
    
    // Process each page
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      try {
        // Report progress
        if (progressCallback) {
          progressCallback((pageNum - 1) / totalPages);
        }
        
        // Get the page
        const page = await pdf.getPage(pageNum);
        
        // Set scale for rendering (higher for better quality)
        const scale = 2.0;
        const viewport = page.getViewport({ scale });
        
        // Prepare canvas for rendering
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) {
          throw new Error('Unable to create canvas context');
        }
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Render PDF page to canvas
        const renderContext = {
          canvasContext: context,
          viewport,
        };
        
        await page.render(renderContext).promise;
        
        // Convert canvas to base64 image
        const imageData = canvas.toDataURL('image/png');
        base64Images.push(imageData);
        
      } catch (error) {
        console.error(`Error processing page ${pageNum}:`, error);
        toast.error(`Error processing page ${pageNum}`);
      }
    }
    
    // Report 100% progress
    if (progressCallback) {
      progressCallback(1);
    }
    
    return base64Images;
    
  } catch (error) {
    console.error('Error converting PDF to images:', error);
    toast.error('Failed to convert PDF to images');
    throw error;
  }
};
