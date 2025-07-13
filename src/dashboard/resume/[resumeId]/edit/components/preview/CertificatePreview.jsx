import React from 'react';
import { Award, Calendar, ExternalLink, FileText } from 'lucide-react';

function CertificatePreview({ certificates }) {
  if (!certificates || certificates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Certificates & Credentials</h3>
      </div>
      
      <div className="space-y-4">
        {certificates.map((certificate, index) => (
          <div key={index} className="border-l-4 border-green-500 pl-4 space-y-2">
            <div className="space-y-1">
              <h4 className="font-semibold text-gray-900 text-sm">
                {certificate.certificateName}
              </h4>
              
              {certificate.issuingOrganization && (
                <p className="text-xs text-gray-600 font-medium">
                  {certificate.issuingOrganization}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {certificate.issueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Issued: {new Date(certificate.issueDate).toLocaleDateString()}</span>
                  </div>
                )}
                
                {certificate.expiryDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Expires: {new Date(certificate.expiryDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              {certificate.credentialId && (
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Credential ID:</span> {certificate.credentialId}
                </p>
              )}
              
              {certificate.credentialUrl && (
                <a 
                  href={certificate.credentialUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Verify Certificate
                </a>
              )}
              
              {certificate.file && (
                <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  <FileText className="w-3 h-3" />
                  <span>{certificate.file.name}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CertificatePreview; 