import React, { useContext, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoaderCircle, Download, Share2, Copy, Check, Mail, Linkedin, Twitter, CheckCircle, PartyPopper } from 'lucide-react';
import { ResumeInfoContext } from '../../../../../../context/ResumeInfoContext';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function ResumeFinal() {
  const { resumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const resumeRef = useRef(null);

  const generateResumeContent = () => {
    const content = `
${resumeInfo?.firstName || 'Your'} ${resumeInfo?.lastName || 'Name'}
${resumeInfo?.jobTitle || 'Professional Title'}
${'='.repeat(50)}

PERSONAL INFORMATION
${'-'.repeat(20)}
${resumeInfo?.address ? `Address: ${resumeInfo.address}` : ''}
${resumeInfo?.phone ? `Phone: ${resumeInfo.phone}` : ''}
${resumeInfo?.email ? `Email: ${resumeInfo.email}` : ''}

${resumeInfo?.summery ? `
SUMMARY
${'-'.repeat(20)}
${resumeInfo.summery}
` : ''}

${resumeInfo?.experience && resumeInfo.experience.length > 0 ? `
PROFESSIONAL EXPERIENCE
${'-'.repeat(20)}
${resumeInfo.experience.map(exp => `
${exp.title || 'Position'} at ${exp.companyName || 'Company'}
${exp.city && exp.state ? `${exp.city}, ${exp.state}` : ''}
${exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : ''}
${exp.workSummery ? exp.workSummery : ''}
`).join('\n')}
` : ''}

${resumeInfo?.education && resumeInfo.education.length > 0 ? `
EDUCATION
${'-'.repeat(20)}
${resumeInfo.education.map(edu => `
${edu.degree || 'Degree'} in ${edu.major || 'Major'}
${edu.universityName || 'University'}
${edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : ''}
${edu.description ? edu.description : ''}
`).join('\n')}
` : ''}

${resumeInfo?.skills && resumeInfo.skills.length > 0 ? `
SKILLS
${'-'.repeat(20)}
${resumeInfo.skills.map(skill => `${skill.skillName}: ${skill.proficiency}%`).join(', ')}
` : ''}

${resumeInfo?.certificates && resumeInfo.certificates.length > 0 ? `
CERTIFICATES
${'-'.repeat(20)}
${resumeInfo.certificates.map(cert => `
${cert.certificateName || 'Certificate Name'}
${cert.issuingOrganization || 'Issuing Organization'}
${cert.issueDate ? `Issued: ${cert.issueDate}` : ''}
${cert.credentialId ? `Credential ID: ${cert.credentialId}` : ''}
`).join('\n')}
` : ''}

---
Generated on: ${new Date().toLocaleDateString()}
Resume ID: ${params?.resumeId}
    `;
    
    return content;
  };

  // Helper functions to check if sections have meaningful content
  const hasContent = (text) => {
    return text && text.trim().length > 0 && text.trim() !== 'undefined' && text.trim() !== 'null';
  };

  const hasArrayContent = (array) => {
    return array && Array.isArray(array) && array.length > 0 && array.some(item => 
      item && typeof item === 'object' && Object.values(item).some(val => hasContent(val))
    );
  };

  const hasExperienceContent = (experience) => {
    return hasArrayContent(experience) && experience.some(exp => 
      hasContent(exp.title) || hasContent(exp.companyName) || hasContent(exp.workSummery)
    );
  };

  const hasEducationContent = (education) => {
    return hasArrayContent(education) && education.some(edu => 
      hasContent(edu.degree) || hasContent(edu.major) || hasContent(edu.universityName)
    );
  };

  const hasSkillsContent = (skills) => {
    return hasArrayContent(skills) && skills.some(skill => hasContent(skill.skillName));
  };

  const hasCertificatesContent = (certificates) => {
    return hasArrayContent(certificates) && certificates.some(cert => 
      hasContent(cert.certificateName) || hasContent(cert.issuingOrganization)
    );
  };

  const hasContactInfo = () => {
    return hasContent(resumeInfo?.email) || hasContent(resumeInfo?.phone) || hasContent(resumeInfo?.address);
  };

  const handleDownload = async () => {
    setDownloading(true);
    
    try {
      // Debug: Log the resume info to see what data we have
      console.log('Resume Info for PDF:', resumeInfo);
      
      // Check if we have any data
      if (!resumeInfo || Object.keys(resumeInfo).length === 0) {
        toast.error("No resume data found. Please complete your resume first.");
        setDownloading(false);
        return;
      }

      // Create a simple text-based PDF using jsPDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Set font
      pdf.setFont('helvetica');
      
      // Starting position
      let y = 20;
      const margin = 20;
      const pageWidth = 210;
      const contentWidth = pageWidth - (2 * margin);
      
      // Helper function to add text with word wrapping
      const addText = (text, fontSize = 12, isBold = false) => {
        if (!text) return y;
        
        pdf.setFontSize(fontSize);
        if (isBold) {
          pdf.setFont('helvetica', 'bold');
        } else {
          pdf.setFont('helvetica', 'normal');
        }
        
        const lines = pdf.splitTextToSize(text, contentWidth);
        
        // Check if we need a new page
        if (y + (lines.length * fontSize * 0.4) > 280) {
          pdf.addPage();
          y = 20;
        }
        
        pdf.text(lines, margin, y);
        y += lines.length * fontSize * 0.4 + 5;
        
        return y;
      };
      
      // Helper function to add section header
      const addSectionHeader = (title) => {
        y = addText(title, 14, true);
        // Add underline
        pdf.line(margin, y - 2, pageWidth - margin, y - 2);
        y += 5;
      };
      
      // Header - Only if we have a name
      const fullName = `${resumeInfo?.firstName || ''} ${resumeInfo?.lastName || ''}`.trim();
      if (hasContent(fullName)) {
        y = addText(fullName, 18, true);
      }
      
      if (hasContent(resumeInfo?.jobTitle)) {
        y = addText(resumeInfo.jobTitle, 14, true);
      }
      
      // Contact Information - Only if we have contact details
      if (hasContactInfo()) {
        const contactInfo = [];
        if (hasContent(resumeInfo?.email)) contactInfo.push(`Email: ${resumeInfo.email}`);
        if (hasContent(resumeInfo?.phone)) contactInfo.push(`Phone: ${resumeInfo.phone}`);
        if (hasContent(resumeInfo?.address)) contactInfo.push(`Address: ${resumeInfo.address}`);
        
        if (contactInfo.length > 0) {
          y = addText(contactInfo.join(' | '), 10);
          y += 10;
        }
      }
      
      // Professional Summary - Only if we have summary content
      if (hasContent(resumeInfo?.summery)) {
        addSectionHeader('Professional Summary');
        y = addText(resumeInfo.summery, 11);
        y += 10;
      }
      
      // Professional Experience - Only if we have experience content
      if (hasExperienceContent(resumeInfo?.experience)) {
        addSectionHeader('Professional Experience');
        
        resumeInfo.experience.forEach(exp => {
          if (hasContent(exp.title)) {
            y = addText(exp.title, 12, true);
          }
          
          const expInfo = [];
          if (hasContent(exp.companyName)) expInfo.push(exp.companyName);
          if (hasContent(exp.city) || hasContent(exp.state)) {
            expInfo.push([exp.city, exp.state].filter(val => hasContent(val)).join(', '));
          }
          if (hasContent(exp.startDate) || hasContent(exp.endDate)) {
            expInfo.push(`${exp.startDate || ''} - ${exp.endDate || 'Present'}`);
          }
          
          if (expInfo.length > 0) {
            y = addText(expInfo.join(' | '), 10);
          }
          
          if (hasContent(exp.workSummery)) {
            y = addText(exp.workSummery, 10);
          }
          
          y += 5;
        });
      }
      
      // Education - Only if we have education content
      if (hasEducationContent(resumeInfo?.education)) {
        addSectionHeader('Education');
        
        resumeInfo.education.forEach(edu => {
          const degreeInfo = [];
          if (hasContent(edu.degree)) degreeInfo.push(edu.degree);
          if (hasContent(edu.major)) degreeInfo.push(edu.major);
          
          if (degreeInfo.length > 0) {
            y = addText(degreeInfo.join(' in '), 12, true);
          }
          
          const eduInfo = [];
          if (hasContent(edu.universityName)) eduInfo.push(edu.universityName);
          if (hasContent(edu.startDate) || hasContent(edu.endDate)) {
            eduInfo.push(`${edu.startDate || ''} - ${edu.endDate || ''}`);
          }
          
          if (eduInfo.length > 0) {
            y = addText(eduInfo.join(' | '), 10);
          }
          
          if (hasContent(edu.description)) {
            y = addText(edu.description, 10);
          }
          
          y += 5;
        });
      }
      
      // Skills - Only if we have skills content
      if (hasSkillsContent(resumeInfo?.skills)) {
        addSectionHeader('Skills');
        const skillsText = resumeInfo.skills
          .filter(skill => hasContent(skill.skillName))
          .map(skill => 
            `${skill.skillName}${hasContent(skill.proficiency) ? ': ' + skill.proficiency + '%' : ''}`
          ).join(', ');
        y = addText(skillsText, 11);
        y += 10;
      }
      
      // Certificates - Only if we have certificates content
      if (hasCertificatesContent(resumeInfo?.certificates)) {
        addSectionHeader('Certificates');
        
        resumeInfo.certificates.forEach(cert => {
          if (hasContent(cert.certificateName)) {
            y = addText(cert.certificateName, 12, true);
          }
          
          const certInfo = [];
          if (hasContent(cert.issuingOrganization)) certInfo.push(cert.issuingOrganization);
          if (hasContent(cert.issueDate)) certInfo.push(cert.issueDate);
          
          if (certInfo.length > 0) {
            y = addText(certInfo.join(' | '), 10);
          }
          
          if (hasContent(cert.credentialId)) {
            y = addText(`Credential ID: ${cert.credentialId}`, 10);
          }
          
          y += 5;
        });
      }
      
      // Check if we have any content at all
      const hasAnyContent = hasContent(fullName) || 
                           hasContent(resumeInfo?.jobTitle) || 
                           hasContactInfo() || 
                           hasContent(resumeInfo?.summery) || 
                           hasExperienceContent(resumeInfo?.experience) || 
                           hasEducationContent(resumeInfo?.education) || 
                           hasSkillsContent(resumeInfo?.skills) || 
                           hasCertificatesContent(resumeInfo?.certificates);
      
      if (!hasAnyContent) {
        toast.error("No content found in resume. Please add some information before downloading.");
        setDownloading(false);
        return;
      }
      
      // Save the PDF
      const filename = `${resumeInfo?.firstName || ''} ${resumeInfo?.lastName || 'Resume'}.pdf`.trim();
      pdf.save(filename);
      
      toast.success("PDF downloaded successfully!");
      
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!shareEmail) {
      toast.error("Please enter an email address");
      return;
    }

    setSharing(true);
    try {
      // Simulate sharing process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would send the resume via email here
      toast.success(`Resume shared with ${shareEmail}!`);
      setShareEmail('');
    } catch (error) {
      console.error('Share error:', error);
      toast.error("Failed to share resume");
    } finally {
      setSharing(false);
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/resume/${params?.resumeId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Resume link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy error:', error);
      toast.error("Failed to copy link");
    }
  };

  const handleSocialShare = (platform) => {
    const shareUrl = `${window.location.origin}/resume/${params?.resumeId}`;
    const text = `Check out my professional resume: ${resumeInfo?.firstName} ${resumeInfo?.lastName}`;
    
    let url;
    switch (platform) {
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'email':
        url = `mailto:?subject=My Resume&body=${encodeURIComponent(text + '\n\n' + shareUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(url, '_blank');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white/70 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl animate-in fade-in duration-500">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <PartyPopper className="w-10 h-10 text-white" />
        </div>
        <h2 className="font-extrabold text-3xl text-gray-900 mb-2">🎉 Resume Complete!</h2>
        <p className="text-xl text-gray-600">Your professional resume is ready to download and share</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Download Section */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200/50 shadow-lg">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-3 text-blue-900">
            <Download className="w-6 h-6" />
            Download Resume
          </h3>
          <p className="text-blue-700 mb-6">
            Download your resume as a professional PDF with all formatting and theme colors preserved.
          </p>
          <Button 
            onClick={handleDownload}
            disabled={downloading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-2 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
          >
            {downloading ? (
              <>
                <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Download Resume
              </>
            )}
          </Button>
        </div>

        {/* Share Section */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200/50 shadow-lg">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-3 text-green-900">
            <Share2 className="w-6 h-6" />
            Share Resume
          </h3>
          <p className="text-green-700 mb-6">
            Share your resume via email or social media.
          </p>
          
          {/* Email Share */}
          <div className="mb-4">
            <Input
              type="email"
              placeholder="Enter email address"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="mb-3 bg-white/80 backdrop-blur border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500/60 transition-all"
            />
            <Button 
              onClick={handleShare}
              disabled={sharing || !shareEmail}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-2 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
            >
              {sharing ? (
                <>
                  <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
                  Sharing...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Share via Email
                </>
              )}
            </Button>
          </div>

          {/* Copy Link */}
          <Button 
            onClick={handleCopyLink}
            variant="outline"
            className="w-full border-green-300 text-green-700 hover:bg-green-50 font-medium px-2 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-xl transition-all duration-200"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Link Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 mr-2" />
                Copy Resume Link
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Social Share Buttons */}
      <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200/50">
        <h3 className="font-bold text-lg mb-4 text-center text-gray-900">Share on Social Media</h3>
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => handleSocialShare('linkedin')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Linkedin className="w-5 h-5 mr-2" />
            LinkedIn
          </Button>
          <Button
            onClick={() => handleSocialShare('twitter')}
            className="bg-sky-500 hover:bg-sky-600 text-white px-2 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Twitter className="w-5 h-5 mr-2" />
            Twitter
          </Button>
          <Button
            onClick={() => handleSocialShare('email')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Mail className="w-5 h-5 mr-2" />
            Email
          </Button>
        </div>
      </div>

      {/* Back to Dashboard */}
      <div className="mt-8 text-center">
        <Button
          onClick={handleBackToDashboard}
          variant="outline"
          className="bg-white/80 backdrop-blur border border-gray-300 text-gray-700 hover:bg-white font-medium px-2 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
        >
          ← Back to Dashboard
        </Button>
      </div>
    </div>
  );
}

export default ResumeFinal; 