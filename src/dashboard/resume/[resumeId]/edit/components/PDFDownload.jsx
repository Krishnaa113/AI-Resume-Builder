import React, { useContext, useRef } from 'react';
import { ResumeInfoContext } from '../../../../../context/ResumeInfoContext';
import html2pdf from 'html2pdf.js';
import { Download, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function PDFDownload({ resumeRef }) {
  const { resumeInfo } = useContext(ResumeInfoContext);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const generatePDF = async () => {
    if (!resumeRef.current) {
      toast.error("Resume content not found");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Clone the resume content for PDF generation
      const resumeElement = resumeRef.current.cloneNode(true);
      
      // Create a temporary container for PDF generation
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '210mm'; // A4 width
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.padding = '20mm';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.fontSize = '12pt';
      tempContainer.style.lineHeight = '1.4';
      tempContainer.style.color = '#333';
      
      // Apply PDF-specific styles to the resume content
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        * {
          font-family: Arial, sans-serif !important;
          font-size: 12pt !important;
          line-height: 1.4 !important;
          color: #333 !important;
        }
        h1, h2, h3, h4, h5, h6 {
          font-weight: bold !important;
          margin-bottom: 8pt !important;
        }
        h3 {
          font-size: 14pt !important;
          border-bottom: 1pt solid #ccc !important;
          padding-bottom: 4pt !important;
        }
        ul, ol {
          margin-left: 20pt !important;
          margin-bottom: 8pt !important;
        }
        li {
          margin-bottom: 4pt !important;
        }
        .space-y-6 > * + * {
          margin-top: 24pt !important;
        }
        .space-y-4 > * + * {
          margin-top: 16pt !important;
        }
        .space-y-3 > * + * {
          margin-top: 12pt !important;
        }
        .space-y-2 > * + * {
          margin-top: 8pt !important;
        }
        .space-y-1 > * + * {
          margin-top: 4pt !important;
        }
        .border-l-4 {
          border-left: 2pt solid #3b82f6 !important;
          padding-left: 8pt !important;
        }
        .text-sm {
          font-size: 11pt !important;
        }
        .text-xs {
          font-size: 10pt !important;
        }
        .font-semibold {
          font-weight: 600 !important;
        }
        .text-gray-900 {
          color: #111827 !important;
        }
        .text-gray-700 {
          color: #374151 !important;
        }
        .text-gray-600 {
          color: #4b5563 !important;
        }
      `;
      
      // Add the resume content and styles
      tempContainer.appendChild(styleElement);
      tempContainer.appendChild(resumeElement);
      document.body.appendChild(tempContainer);

      // Configure PDF options
      const opt = {
        margin: [15, 15, 15, 15],
        filename: `${resumeInfo?.personalDetails?.fullName || 'Resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };

      // Generate PDF
      await html2pdf().set(opt).from(tempContainer).save();
      
      // Clean up
      document.body.removeChild(tempContainer);
      toast.success("PDF downloaded successfully!");
      
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        data-pdf-download
        onClick={generatePDF}
        disabled={isGenerating}
        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        size="sm"
      >
        {isGenerating ? (
          <>
            <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </>
        )}
      </Button>
    </div>
  );
}

export default PDFDownload; 