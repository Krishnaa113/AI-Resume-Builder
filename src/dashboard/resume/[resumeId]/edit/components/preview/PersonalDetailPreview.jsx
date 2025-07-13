import React from 'react'
import { User, Mail, Phone, MapPin, Briefcase } from 'lucide-react'

function PersonalDetailPreview({resumeInfo}) {
  return (
    <div className="text-center space-y-4 animate-in fade-in duration-500">
      {/* Name */}
      <div className="space-y-2">
        <h1 className="font-bold text-3xl text-gray-900 tracking-tight">
          {resumeInfo?.firstName} {resumeInfo?.lastName}
        </h1>
        
        {/* Job Title */}
        {resumeInfo?.jobTitle && (
          <div className="flex items-center justify-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <h2 className="text-lg font-semibold text-blue-600">
              {resumeInfo.jobTitle}
            </h2>
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
        {resumeInfo?.address && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>{resumeInfo.address}</span>
          </div>
        )}
        
        {resumeInfo?.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" />
            <span>{resumeInfo.phone}</span>
          </div>
        )}
        
        {resumeInfo?.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <span>{resumeInfo.email}</span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div 
        className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
        style={{
          background: resumeInfo?.themeColor ? `linear-gradient(to right, ${resumeInfo.themeColor}, ${resumeInfo.themeColor}80)` : 'linear-gradient(to right, #3b82f6, #8b5cf6)'
        }}
      ></div>
    </div>
  )
}

export default PersonalDetailPreview