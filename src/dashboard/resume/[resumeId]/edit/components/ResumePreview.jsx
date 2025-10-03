import React, { useContext, useMemo } from 'react'
import { ResumeInfoContext } from '../../../../../context/ResumeInfoContext'
import PersonalDetailPreview from './preview/PersonalDetailPreview';
import SummeryPreview from './preview/SummeryPreview';
import ExperiencePreview from './preview/ExperiencePreview';
import EducationalPreview from './preview/EducationalPreview';
import SkillsPreview from './preview/SkillsPreview';
import CertificatePreview from './preview/CertificatePreview';
import { FileText, Share2, Eye } from 'lucide-react';

function ResumePreview({ activeStep }) {
  const { resumeInfo } = useContext(ResumeInfoContext);
  
  // Memoize the theme color to prevent unnecessary re-renders
  const themeColor = useMemo(() => {
    return resumeInfo?.themeColor ? `linear-gradient(to right, ${resumeInfo.themeColor}, ${resumeInfo.themeColor}80)` : 'linear-gradient(to right, #3b82f6, #8b5cf6)';
  }, [resumeInfo?.themeColor]);

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

          <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Resume Content */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
        {/* Resume Header with Theme Color */}
        <div 
          className="h-2"
          style={{
            background: themeColor
          }}
        ></div>
        
        {/* Resume Content */}
        <div data-resume-preview className="p-8 space-y-6">
          {/* Personal details */}
          <div>
            <PersonalDetailPreview resumeInfo={resumeInfo} />
          </div>
          
          {/* Summary */}
          <div>
            <SummeryPreview resumeInfo={resumeInfo} />
          </div>
          
          {/* Professional Experience */}
          <div>
            <ExperiencePreview resumeInfo={resumeInfo} />
          </div>
          
          {/* Educational */}
          <div>
            <EducationalPreview resumeInfo={resumeInfo} />
          </div>
          
          {/* Skills */}
          <div>
            <SkillsPreview resumeInfo={resumeInfo} />
          </div>
          
          {/* Certificates */}
          <div>
            <CertificatePreview certificates={resumeInfo?.certificates} />
          </div>
        </div>
      </div>


    </div>
  )
}

export default ResumePreview