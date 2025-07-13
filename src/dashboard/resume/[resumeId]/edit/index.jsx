import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import FormSection from './components/FormSection';
import ResumePreview from './components/ResumePreview';
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext';
import Header from '../../../../components/custom/Header';

function EditResume() {
  const params = useParams();
  const [resumeInfo, setResumeInfo] = useState();
  const [activeStep, setActiveStep] = useState(1);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header  className='mb-20 pb-7'/>
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Main Content - 2 column grid on desktop, stacked on mobile */}
        <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="flex flex-col justify-center h-full">
              <div className="flex-1 flex flex-col justify-center h-full min-h-[600px] bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 animate-in slide-in-from-left-4">
                <FormSection 
                  onStepChange={setActiveStep}
                  activeStep={activeStep}
                />
              </div>
            </div>
            {/* Preview Section */}
            <div className="flex flex-col justify-center h-full">
              <div className="flex-1 flex flex-col justify-center h-full min-h-[600px] bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 animate-in slide-in-from-right-4">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Live Preview</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Live
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <ResumePreview />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResumeInfoContext.Provider>
  )
}

export default EditResume