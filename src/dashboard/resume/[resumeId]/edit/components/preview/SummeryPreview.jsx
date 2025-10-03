import React from 'react'
import { FileText } from 'lucide-react'

function SummeryPreview({resumeInfo}) {
  if (!resumeInfo?.summery) return null;

  // Convert summary text to bullet points if it contains bullet markers
  const formatSummary = (summary) => {
    if (summary.includes('•')) {
      const points = summary.split('•').filter(point => point.trim());
      return (
        <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
          {points.map((point, index) => (
            <li key={index} className="leading-relaxed">
              {point.trim()}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p className="text-gray-700 leading-relaxed text-sm">
        {summary}
      </p>
    );
  };

  return (
    <div className="space-y-3 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900">Professional Summary</h3>
      </div>
      {formatSummary(resumeInfo.summery)}
    </div>
  )
}

export default SummeryPreview