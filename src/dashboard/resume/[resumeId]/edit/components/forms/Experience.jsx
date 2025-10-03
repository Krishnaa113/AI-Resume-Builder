import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useCallback, useMemo } from 'react';
import { useState,useEffect,useContext } from 'react';
import RichTextEditor from '../RichTextEditor';
import {ResumeInfoContext} from '@/context/ResumeInfoContext';
import GlobalAPi from '../../../../../../../service/GlobalAPi';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';

const formField={
    title:'',
    companyName:'',
    city:'',
    state:'',
    startDate:'',
    endDate:'',
    workSummery:''
}
function Experience({enableNext}) {
    const [experienceList,setExperienceList]=useState([formField]);
    const [loading,setLoading]=useState(false);
    const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext);
    const params=useParams();

    const handleChange = useCallback((index, event) => {
       enableNext(false);
       const newEntries = experienceList.slice();
       const {name, value} = event.target;
       newEntries[index][name] = value;
       setExperienceList(newEntries);
    }, [experienceList, enableNext]);

    const AddNewExperience = useCallback(() => {
        setExperienceList(prev => [...prev, formField]);
    }, []);

    const RemoveExperience = useCallback((index) => {
        if (experienceList.length > 1) {
            setExperienceList(prev => prev.filter((_, i) => i !== index));
        }
    }, [experienceList.length]);

    const handleRichTextEditor = useCallback((index, name, e) => {
       enableNext(false);
       const newEntries = experienceList.slice();
       newEntries[index][name] = e.target.value;
       setExperienceList(newEntries);
    }, [experienceList, enableNext]);

    useEffect(()=>{
       setResumeInfo({
           ...resumeInfo,
           experience:experienceList
       })
    },[experienceList])

    const onSave=(e)=>{
        e.preventDefault();
        setLoading(true);
        
        // Check if experienceList exists and has data
        if (!experienceList || experienceList.length === 0) {
            toast("Please add at least one experience entry");
            setLoading(false);
            return;
        }
        
        const data={
            experience:experienceList
        }
        console.log("Sending data to API:", data);
        console.log("Resume ID:", params?.resumeId);
        console.log("Experience list:", experienceList);
        
        GlobalAPi.UpdateResumeDetail(params?.resumeId,data)
        .then(resp=>{
              console.log("API Response:", resp);
              console.log("Response data:", resp.data);
              enableNext(true);
              setLoading(false);
              toast("Updated");
          },(error)=>{
               console.error("Error saving experience:", error);
               console.error("Error response:", error.response);
               console.error("Error status:", error.response?.status);
               console.error("Error data:", error.response?.data);
               console.error("Error details:", error.response?.data?.error);
               setLoading(false);
               toast("Error saving experience data");
               }
        )
    }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="p-8 bg-white/70 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl animate-in fade-in duration-500">
        <h2 className="font-extrabold text-2xl text-gray-900 mb-1">Professional Details</h2>
        <p className="text-gray-600 mb-6">Add your previous job experience</p>
        <form onSubmit={onSave} className="space-y-8">
          <div className="space-y-8">
            {experienceList.map((item, index) => (
              <div key={index} className="relative group border border-white/20 bg-white/60 backdrop-blur rounded-xl  p-6 transition-all duration-300 ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Position Title</label>
                    <Input name="title" value={item.title} onChange={(event) => handleChange(index, event)} className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/60 transition-all" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Company Name</label>
                    <Input name="companyName" value={item.companyName} onChange={(event) => handleChange(index, event)} className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/60 transition-all" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">City</label>
                    <Input name="city" value={item.city} onChange={(event) => handleChange(index, event)} className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/60 transition-all" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">State</label>
                    <Input name="state" value={item.state} onChange={(event) => handleChange(index, event)} className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/60 transition-all" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Start Date</label>
                    <Input type="date" name="startDate" value={item.startDate} onChange={(event) => handleChange(index, event)} className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/60 transition-all" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">End Date</label>
                    <Input type="date" name="endDate" value={item.endDate} onChange={(event) => handleChange(index, event)} className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/60 transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-1">Work Summary</label>
                    <RichTextEditor
                      index={index}
                      onRichTextEditorChange={(event) => handleRichTextEditor(index, 'workSummery',event)}
                      className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/60 transition-all min-h-[60px]"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button type="button" variant="outline" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md hover:scale-105 active:scale-95 transition-all w-20" onClick={AddNewExperience}> Add More</Button>
                  <Button type="button" variant="outline" className="bg-red-500/90 text-white font-semibold shadow-md hover:scale-105 active:scale-95 transition-all w-15" onClick={() => RemoveExperience(index)} disabled={experienceList.length === 1}> Remove</Button>
                </div>
              </div>
            ))}
          </div>
          <div className=" bottom-0 bg-transparent pt-4 flex justify-end z-10">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-2 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Experience
