import React, { useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoaderCircle, Download, Share2, Copy, Check, Mail, Linkedin, Twitter, CheckCircle, PartyPopper } from 'lucide-react';
import { ResumeInfoContext } from '../../../../../../context/ResumeInfoContext';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function ResumeFinal() {
  const { resumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [copied, setCopied] = useState(false);

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

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate resume content
      const content = generateResumeContent();
      
      // Create and download file
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeInfo?.firstName || 'Resume'}_${resumeInfo?.lastName || 'Resume'}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Resume downloaded successfully!");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download resume");
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
            Download your resume as a text file that you can easily share or print.
          </p>
          <Button 
            onClick={handleDownload}
            disabled={downloading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
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
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
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
            className="w-full border-green-300 text-green-700 hover:bg-green-50 font-medium py-3 rounded-xl transition-all duration-200"
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Linkedin className="w-5 h-5 mr-2" />
            LinkedIn
          </Button>
          <Button
            onClick={() => handleSocialShare('twitter')}
            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Twitter className="w-5 h-5 mr-2" />
            Twitter
          </Button>
          <Button
            onClick={() => handleSocialShare('email')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
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
          className="bg-white/80 backdrop-blur border border-gray-300 text-gray-700 hover:bg-white font-medium px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
        >
          ← Back to Dashboard
        </Button>
      </div>
    </div>
  );
}

export default ResumeFinal; 