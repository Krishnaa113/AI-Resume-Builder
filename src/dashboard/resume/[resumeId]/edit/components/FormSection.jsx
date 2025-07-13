import React, { useState, useEffect, useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import PersonalDetail from './forms/PersonalDetail'
import { Button } from '../../../../../components/ui/button'
import { ArrowLeft, ArrowRight, Sparkles, ChevronDown } from 'lucide-react'
import Summery from './forms/Summery';
import Experience from './forms/Experience';
import Education from './forms/Education';
import Skills from './forms/Skills';
import Certificate from './forms/Certificate';
import ResumeFinal from './forms/ResumeFinal';
import { ResumeInfoContext } from '../../../../../context/ResumeInfoContext';

function FormSection({ onStepChange, activeStep }) {
  const [searchParams] = useSearchParams();
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(true);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  useEffect(() => {
    const step = searchParams.get('step');
    if (step) {
      setActiveFormIndex(parseInt(step));
    }
  }, [searchParams]);

  useEffect(() => {
    if (onStepChange) {
      onStepChange(activeFormIndex);
    }
  }, [activeFormIndex, onStepChange]);

  const handleNext = () => {
    if (activeFormIndex < 7 && enableNext) {
      setActiveFormIndex(activeFormIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (activeFormIndex > 1) {
      setActiveFormIndex(activeFormIndex - 1);
    }
  };

  // Theme color options
  const themeColors = [
    { name: 'Blue/Purple', value: '#3b82f6' },
    { name: 'Green/Teal', value: '#10b981' },
    { name: 'Orange/Red', value: '#f59e42' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Gray', value: '#64748b' },
  ];

  const handleThemeChange = (color) => {
    setResumeInfo({ ...resumeInfo, themeColor: color });
    setIsThemeDropdownOpen(false);
  };

  const renderForm = () => {
    const forms = [
      <PersonalDetail key="personal" enableNext={(v) => setEnableNext(v)} />,
      <Summery key="summary" enableNext={(v) => setEnableNext(v)} />,
      <Experience key="experience" enableNext={(v) => setEnableNext(v)} />,
      <Education key="education" enableNext={(v) => setEnableNext(v)} />,
      <Skills key="skills" enableNext={(v) => setEnableNext(v)} />,
      <Certificate key="certificate" enableNext={(v) => setEnableNext(v)} />,
      <ResumeFinal key="final" />
    ];

    return forms[activeFormIndex - 1];
  };

  return (
    <div className="space-y-6">
      {/* Form Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"
              onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
            >
              Theme
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isThemeDropdownOpen ? 'rotate-180' : ''}`} />
            </Button>
            
            {isThemeDropdownOpen && (
              <div className="absolute left-0 mt-2 w-40 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1">
                  {themeColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-blue-100"
                      onClick={() => handleThemeChange(color.value)}
                    >
                      <span className="inline-block w-4 h-4 rounded-full mr-2" style={{ background: color.value }}></span>
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>AI-Powered Builder</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {activeFormIndex > 1 && (
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrevious}
              className="bg-white/80 backdrop-blur border-gray-200 hover:bg-white transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}
          
          {activeFormIndex < 7 && (
            <Button
              size="sm"
              onClick={handleNext}
              disabled={!enableNext}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Form Content with Animation */}
      <div className="animate-in fade-in duration-300">
        {renderForm()}
      </div>
    </div>
  )
}

export default FormSection