import React, { useContext, useEffect, useState } from 'react'
import { Button } from '../../../../../../components/ui/button'
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from '../../../../../../context/ResumeInfoContext';
import { LoaderCircle } from 'lucide-react';
import GlobalAPi from '../../../../../../../service/GlobalAPi';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {createChatSession} from '../../../../../../../service/AIModals';

const prompt = `Based on the job title "{jobTitle}", generate a professional resume summary in JSON format with the following structure:
{
  "experienceLevel": "Fresher|Mid-Level|Experienced",
  "summary": [
    "Point 1: Key skill or achievement relevant to the job",
    "Point 2: Professional experience or qualification",
    "Point 3: Technical expertise or specialization",
    "Point 4: Leadership or project management experience",
    "Point 5: Career objective or value proposition"
  ]
}

Please provide a summary that:
- Contains exactly 5 bullet points
- Each point is concise and impactful
- Highlights relevant skills and experience for the job title
- Uses action verbs and professional language
- Is tailored to the specific industry and role`;
function Summery({enableNext}) {
 
const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext);
const [summery,setSummery]=useState();
const [loading,setLoading]=useState(false);
const params=useParams();
const [aiGenerateSummeryList,setAiGenerateSummeryList]=useState();

useEffect(()=>{
   summery&&setResumeInfo({
      ...resumeInfo,
      summery:summery
   })
},[summery])


const GenerateSummeryFromAI = async () => {
  if (!resumeInfo?.jobTitle) {
    toast.error("Please enter a job title before generating a summary.");
    return;
  }

  setLoading(true);

  try {
    const PROMPT = prompt.replace('{jobTitle}', resumeInfo.jobTitle);
    const session = await createChatSession();
    const result = await session.sendMessage(PROMPT);
    const responseText = await result.response.text();
    
    // Try to parse JSON response
    let aiSummary;
    try {
      aiSummary = JSON.parse(responseText);
    } catch (parseError) {
      // If JSON parsing fails, try to extract summary from text
      console.warn("Failed to parse JSON, trying to extract from text:", parseError);
      const summaryMatch = responseText.match(/summary["\s]*:["\s]*"([^"]+)"/i);
      if (summaryMatch) {
        aiSummary = { summary: summaryMatch[1] };
      } else {
        // Fallback: use the entire response as summary
        aiSummary = { summary: responseText.trim() };
      }
    }
    
    // Set the summary - handle both array and string formats
    let finalSummary;
    if (Array.isArray(aiSummary.summary)) {
      finalSummary = aiSummary.summary.join('\n• ');
      if (!finalSummary.startsWith('• ')) {
        finalSummary = '• ' + finalSummary;
      }
    } else if (aiSummary.summary) {
      finalSummary = aiSummary.summary;
    } else if (aiSummary.summery) {
      finalSummary = aiSummary.summery;
    } else {
      finalSummary = responseText.trim();
    }
    
    setSummery(finalSummary);
    toast.success("AI summary generated successfully!");
    
  } catch (error) {
    console.error("AI generation error:", error);
    let errorMsg = "Failed to generate summary from AI. Please try again.";
    
    if (error?.message) {
      errorMsg += ` Error: ${error.message}`;
    }
    
    toast.error(errorMsg);
  } finally {
    setLoading(false);
  }
};



const onSave=(e)=>{
  e.preventDefault();
  setLoading(true);
  const data={
      summery:summery
  }
  GlobalAPi.UpdateResumeDetail(params?.resumeId,data)
  .then(resp=>{
        console.log(resp);
        enableNext(true);
        setLoading(false);
        toast("Updated");

    },(error)=>{
         setLoading(false);
         }

  )
}
  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white/70 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl animate-in fade-in duration-500">
      <h2 className="font-extrabold text-2xl text-gray-900 mb-1">Summary</h2>
      <p className="text-gray-600 mb-6">Add a summary for your job title</p>
      <form onSubmit={onSave} className="space-y-8">
        <div className="flex justify-between items-end">
          <label className="block text-gray-700 font-medium mb-1">Add Summary</label>
          <Button 
            size="sm" 
            variant="outline" 
            type="button" 
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm" 
            onClick={GenerateSummeryFromAI}
          >
            {loading ? (
              <>
                <LoaderCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Generate With AI</span>
                <span className="sm:hidden">Generate</span>
              </>
            )}
          </Button>
        </div>
        <div>
          <Textarea 
            className="mt-5 bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/60 transition-all min-h-[80px]" 
            onChange={(e) => setSummery(e.target.value)} 
            placeholder="Enter your professional summary or use AI to generate one..."
          />
        </div>
        <div className=" bottom-0 bg-transparent pt-4 flex justify-end z-10">
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-2 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all" disabled={loading}>
            {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Summery