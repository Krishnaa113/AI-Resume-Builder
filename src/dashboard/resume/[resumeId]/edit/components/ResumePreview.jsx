import React, { useContext } from 'react'
import { ResumeInfoContext } from '../../../../../context/ResumeInfoContext'
import PersonalDetailPreview from './preview/PersonalDetailPreview';
import SummeryPreview from './preview/SummeryPreview';
import ExperiencePreview from './preview/ExperiencePreview';
import EducationalPreview from './preview/EducationalPreview';
import SkillsPreview from './preview/SkillsPreview';
import CertificatePreview from './preview/CertificatePreview';
import { FileText, Download, Share2, Eye } from 'lucide-react';

function ResumePreview() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  return (
    <div className="relative">
      {/* Preview Header */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Resume Preview</h3>
            <p className="text-sm text-gray-600">Real-time updates</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Resume Content */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden animate-in fade-in duration-500">
        {/* Resume Header with Theme Color */}
        <div 
          className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"
          style={{
            background: resumeInfo?.themeColor ? `linear-gradient(to right, ${resumeInfo.themeColor}, ${resumeInfo.themeColor}80)` : 'linear-gradient(to right, #3b82f6, #8b5cf6)'
          }}
        ></div>
        
        {/* Resume Content */}
        <div className="p-8 space-y-6">
          {/* Personal details */}
          <div className="animate-in slide-in-from-top-2 duration-300">
            <PersonalDetailPreview resumeInfo={resumeInfo} />
          </div>
          
          {/* Summary */}
          <div className="animate-in slide-in-from-top-2 duration-300" style={{ animationDelay: '100ms' }}>
            <SummeryPreview resumeInfo={resumeInfo} />
          </div>
          
          {/* Professional Experience */}
          <div className="animate-in slide-in-from-top-2 duration-300" style={{ animationDelay: '200ms' }}>
            <ExperiencePreview resumeInfo={resumeInfo} />
          </div>
          
          {/* Educational */}
          <div className="animate-in slide-in-from-top-2 duration-300" style={{ animationDelay: '300ms' }}>
            <EducationalPreview resumeInfo={resumeInfo} />
          </div>
          
          {/* Skills */}
          <div className="animate-in slide-in-from-top-2 duration-300" style={{ animationDelay: '400ms' }}>
            <SkillsPreview resumeInfo={resumeInfo} />
          </div>
          
          {/* Certificates */}
          <div className="animate-in slide-in-from-top-2 duration-300" style={{ animationDelay: '500ms' }}>
            <CertificatePreview certificates={resumeInfo?.certificates} />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 flex items-center justify-center">
          <Download className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

export default ResumePreview