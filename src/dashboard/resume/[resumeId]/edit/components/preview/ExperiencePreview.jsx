import React from 'react'
import { Briefcase, MapPin, Calendar } from 'lucide-react'

function ExperiencePreview({resumeInfo}) {
  if (!resumeInfo?.experience || resumeInfo.experience.length === 0) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900">Professional Experience</h3>
      </div>
      
      <div className="space-y-4">
        {resumeInfo.experience.map((experience, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4 space-y-2">
            <div className="space-y-1">
              <h4 className="font-semibold text-gray-900 text-sm">
                {experience?.title}
              </h4>
              
              <div className="flex items-center gap-4 text-xs text-gray-600">
                {experience?.companyName && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{experience.companyName}</span>
                  </div>
                )}
                
                {(experience?.city || experience?.state) && (
                  <div className="flex items-center gap-1">
                    <span>{[experience.city, experience.state].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                
                {(experience?.startDate || experience?.endDate) && (
                  <div className="flex items-center gap-1">
                    <span>
                      {experience.startDate} - {experience?.currentlyWorking ? 'Present' : experience.endDate}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {experience?.workSummery && (
              <div 
                className="text-xs text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: experience.workSummery }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExperiencePreview