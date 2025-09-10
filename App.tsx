
import React, { useState } from 'react';
import { CVData, Template } from './types';
import { INITIAL_CV_DATA, TEMPLATES } from './constants';
import CvForm from './components/CvForm';
import CvPreview from './components/CvPreview';
import { Button } from './components/ui/Button';

// These will be available globally from index.html
declare const html2canvas: any;
declare const jspdf: any;

function App() {
  const [cvData, setCvData] = useState<CVData>(INITIAL_CV_DATA);
  const [template, setTemplate] = useState<Template>(Template.Modern);

  const handleExportPdf = () => {
    const cvElement = document.getElementById('cv-preview');
    if (cvElement) {
        const { jsPDF } = jspdf;
        html2canvas(cvElement, { 
            scale: 3, // Higher scale for better quality
            useCORS: true, 
            logging: true,
        }).then((canvas: any) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            let imgHeight = pdfWidth / ratio;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = position - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
            pdf.save(`${cvData.personalInfo.fullName.replace(' ','_')}_CV.pdf`);
        });
    }
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">AI CV Builder</h1>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Template:</span>
                {TEMPLATES.map(t => (
                    <button key={t} onClick={() => setTemplate(t)} className={`px-3 py-1 text-sm rounded-md transition-colors ${template === t ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                        {t}
                    </button>
                ))}
             </div>
            <Button onClick={handleExportPdf}>Export as PDF</Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="h-[calc(100vh-100px)] overflow-y-auto pr-4">
          <CvForm cvData={cvData} setCvData={setCvData} />
        </div>
        <div className="flex justify-center h-[calc(100vh-100px)] overflow-y-auto sticky top-[80px]">
          <div className="transform scale-[0.8] origin-top">
            <CvPreview cvData={cvData} template={template} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
