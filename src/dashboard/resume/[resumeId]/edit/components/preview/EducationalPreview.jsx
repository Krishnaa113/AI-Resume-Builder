import React from 'react'
import { GraduationCap, Calendar, MapPin } from 'lucide-react'

function EducationalPreview({resumeInfo}) {
  if (!resumeInfo?.education || resumeInfo.education.length === 0) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900">Education</h3>
      </div>
      
      <div className="space-y-4">
        {resumeInfo.education.map((education, index) => (
          <div key={index} className="border-l-4 border-green-500 pl-4 space-y-2">
            <div className="space-y-1">
              <h4 className="font-semibold text-gray-900 text-sm">
                {education?.universityName}
              </h4>
              
              <div className="flex items-center gap-4 text-xs text-gray-600">
                {(education?.degree || education?.major) && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">
                      {education.degree} {education.degree && education.major ? 'in' : ''} {education.major}
                    </span>
                  </div>
                )}
                
                {(education?.startDate || education?.endDate) && (
                  <div className="flex items-center gap-1">
                    <span>
                      {education.startDate} - {education.endDate}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {education?.description && (
              <p className="text-xs text-gray-700 leading-relaxed">
                {education.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default EducationalPreview