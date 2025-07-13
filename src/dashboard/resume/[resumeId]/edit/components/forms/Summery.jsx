import React, { useContext, useEffect, useState } from 'react'
import { Button } from '../../../../../../components/ui/button'
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from '../../../../../../context/ResumeInfoContext';
import { LoaderCircle } from 'lucide-react';
import GlobalAPi from '../../../../../../../service/GlobalAPi';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {createChatSession} from '../../../../../../../service/AIModals';

const prompt= "Job Title: {jobTitle},Depends on job title give me summery for my resume within 4-5 lines iin JSON format with field experience level ans Summery with Experience level for Fresher,Mid-Level,Experienced";
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


const GenerateSummeryFromAI =async()=> {
  setLoading(true);
  const PROMPT=prompt.replace('{jobTitle}',resumeInfo?.jobTitle);
  console.log(PROMPT);
  const result= await createChatSession.sendMessage(PROMPT);
  console.log(JSON.parse(result.response.text())); 
  setAiGenerateSummeryList([JSON.parse(result.response.text())])
  setLoading(false);
}


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
          <Button size="sm" variant="outline" type="button" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md hover:scale-105 active:scale-95 transition-all" onClick={GenerateSummeryFromAI}>
            Generate With AI
          </Button>
        </div>
        <div>
          <Textarea className="mt-5 bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/60 transition-all min-h-[80px]" onChange={(e) => setSummery(e.target.value)} />
        </div>
        <div className="sticky bottom-0 bg-transparent pt-4 flex justify-end z-10">
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all" disabled={loading}>
            {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </form>
      {aiGenerateSummeryList && (
        <div className="mt-8 p-4 bg-white/80 backdrop-blur rounded-xl shadow border border-white/20 animate-in fade-in duration-500">
          <h2 className="font-bold text-lg mb-2">Suggestion</h2>
          {aiGenerateSummeryList.map((item, index) => (
            <div key={index} className="mb-2">
              <h3 className="font-semibold">Level: {item?.experienceLevel}</h3>
              <p>{item?.summery}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Summery