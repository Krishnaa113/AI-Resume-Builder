import { Notebook, Edit, Download, MoreVertical, Trash2, Eye, CheckCircle, Calendar, User } from 'lucide-react'
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner'

function ResumeItem({resume, onDelete}) {
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const generateResumeContent = () => {
    const content = `
${resume.title.toUpperCase()}
${'='.repeat(resume.title.length)}

PERSONAL INFORMATION
${'-'.repeat(20)}
Name: [Your Name]
Email: [your.email@example.com]
Phone: [Your Phone]
Address: [Your Address]

SUMMARY
${'-'.repeat(20)}
[Your professional summary would appear here]

EXPERIENCE
${'-'.repeat(20)}
[Your work experience would be listed here]

EDUCATION
${'-'.repeat(20)}
[Your educational background would be listed here]

SKILLS
${'-'.repeat(20)}
[Your skills and proficiency levels would be listed here]

---
Generated on: ${new Date().toLocaleDateString()}
Resume ID: ${resume.documentId}
    `;
    
    return content;
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const content = generateResumeContent();
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume.title.replace(/\s+/g, '_')}_resume.txt`;
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

  const handleEdit = () => {
    navigate(`/dashboard/resume/${resume.documentId}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${resume.title}"?`)) {
      return;
    }
    
    setDeleting(true);
    try {
      if (onDelete) {
        await onDelete(resume.documentId);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Failed to delete resume");
    } finally {
      setDeleting(false);
    }
  };

  const handlePreview = () => {
    toast.info("Preview functionality coming soon!");
  };

  const handleViewFinal = () => {
    window.location.href = `/dashboard/resume/${resume.documentId}/edit?step=7`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 h-[300px] flex flex-col justify-between p-6 animate-in slide-in-from-bottom-4 cursor-pointer">
      {/* Always visible 3-dot menu in top-right */}
      <div className="absolute top-4 right-4 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 p-0 bg-white/95 hover:bg-gray-100 border border-gray-200 shadow-lg text-gray-700 cursor-pointer">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 z-50 shadow-2xl bg-white/95 backdrop-blur-lg border border-gray-200 rounded-xl animate-in fade-in slide-in-from-top-2">
            <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Edit Resume
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleViewFinal} className="cursor-pointer">
              <CheckCircle className="mr-2 h-4 w-4" />
              View Final Resume
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePreview} className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownload} disabled={downloading} className="cursor-pointer">
              <Download className="mr-2 h-4 w-4" />
              {downloading ? 'Downloading...' : 'Download PDF'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleDelete} 
              disabled={deleting}
              className="text-red-600 focus:text-red-600 cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleting ? 'Deleting...' : 'Delete Resume'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <NavLink to={"/dashboard/resume/"+resume.documentId+"/edit"} className="flex-1 flex flex-col justify-center cursor-pointer">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Notebook className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center group-hover:text-blue-600 transition-colors duration-300">
            {resume.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(resume.createdAt)}</span>
          </div>
          {resume.userName && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User className="w-4 h-4" />
              <span>{resume.userName}</span>
            </div>
          )}
        </div>
      </NavLink>
    </div>
  )
}

export default ResumeItem