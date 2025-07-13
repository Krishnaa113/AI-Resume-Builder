import React from 'react'
import { Sparkles, Star } from 'lucide-react'

function SkillsPreview({resumeInfo}) {
  if (!resumeInfo?.skills || resumeInfo.skills.length === 0) return null;

  // Removed renderStars and star icons

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        {/* Removed Sparkles icon */}
        <h3 className="text-lg font-semibold text-gray-900">Skills & Expertise</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resumeInfo.skills.map((skill, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{skill.name}</span>
              <span className="text-xs text-gray-600 font-medium">{skill.rating}%</span>
            </div>
            
            <div className="space-y-1">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${skill.rating}%` }}
                ></div>
              </div>
              {/* Removed star icons */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkillsPreview