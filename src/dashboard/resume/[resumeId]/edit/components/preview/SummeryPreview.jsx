import React from 'react'
import { FileText } from 'lucide-react'

function SummeryPreview({resumeInfo}) {
  if (!resumeInfo?.summery) return null;

  return (
    <div className="space-y-3 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900">Professional Summary</h3>
      </div>
      <p className="text-gray-700 leading-relaxed text-sm">
        {resumeInfo.summery}
      </p>
    </div>
  )
}

export default SummeryPreview