import { Input } from '@/components/ui/input';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { ResumeInfoContext } from '../../../../../../context/ResumeInfoContext';
import GlobalAPi from '../../../../../../../service/GlobalAPi';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

function Skills({enableNext}) {
   const [loading,setLoading]=useState(false);
   const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext);
   const params=useParams();
   
  const [skillsList,setSkillsList]=useState(
    [
      {
        name:'',
        rating:50
      }
    ]
  )
  
  const handleChange=(event,index)=>{
    enableNext(false);
    const { name, value } = event.target;
    const updatedList = [...skillsList];
    updatedList[index] = {
      ...updatedList[index],
      [name]: name === 'rating' ? parseInt(value) : value
    };
    setSkillsList(updatedList);
  }
  
  const AddNewSkill=()=>{
    setSkillsList([...skillsList, {
      name:'',
      rating:50
    }]);
  }
  
   const RemoveSkill=(index)=>{
    if (skillsList.length > 1) {
      const updatedList = skillsList.filter((_, i) => i !== index);
      setSkillsList(updatedList);
    }
  }

  useEffect(()=>{
    setResumeInfo({
      ...resumeInfo,
      skills:skillsList
    })
  },[skillsList])

  const onSave=(e)=>{
    e.preventDefault();
    setLoading(true);
    
    // Check if skillsList exists and has data
    if (!skillsList || skillsList.length === 0) {
        toast("Please add at least one skill");
        setLoading(false);
        return;
    }
    
    const data={
        skills:skillsList
    }
    console.log("Sending data to API:", data);
    console.log("Resume ID:", params?.resumeId);
    
    GlobalAPi.UpdateResumeDetail(params?.resumeId,data)
    .then(resp=>{
          console.log("API Response:", resp);
          enableNext(true);
          setLoading(false);
          toast("Updated");
      },(error)=>{
           console.error("Error saving skills:", error);
           console.error("Error response:", error.response);
           console.error("Error status:", error.response?.status);
           console.error("Error data:", error.response?.data);
           setLoading(false);
           toast("Error saving skills data");
           }
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white/70 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl animate-in fade-in duration-500">
      <h2 className="font-extrabold text-2xl text-gray-900 mb-1">Skills & Expertise</h2>
      <p className="text-gray-600 mb-6">Showcase your technical and professional skills</p>
      <form onSubmit={onSave} className="space-y-8">
        <div className="space-y-8">
          {skillsList.map((item,index)=>(
             <div key={index} className="relative group border border-white/20 bg-white/60 backdrop-blur rounded-xl p-6 transition-all duration-300 ">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Skill Name</label>
                  <Input 
                    name="name" 
                    value={item.name}
                    placeholder="e.g., React, JavaScript, Python"
                    onChange={(e)=>handleChange(e,index)}
                    className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Proficiency Level</label>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-3'>
                      <Input 
                        type="range"
                        min="0"
                        max="100"
                        step="20"
                        name="rating" 
                        value={item.rating}
                        onChange={(e)=>handleChange(e,index)}
                        className='flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                      />
                      <span className='text-sm font-bold text-gray-700 min-w-[3rem]'>{item.rating}%</span>
                    </div>
                  </div>
                </div>
               </div>
               <div className="flex gap-3 mt-4">
                 <Button type="button" variant="outline" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md hover:scale-105 active:scale-95 transition-all w-20" onClick={AddNewSkill}>Add More</Button>
                 <Button type="button" variant="outline" className="bg-red-500/90 text-white font-semibold shadow-md hover:scale-105 active:scale-95 transition-all w-15" onClick={() => RemoveSkill(index)} disabled={skillsList.length === 1}>Remove</Button>
               </div>
             </div>
          ))}
        </div>
        <div className=" bottom-0 bg-transparent pt-4 flex justify-end z-10">
          <Button 
            type="submit" 
            disabled={loading} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Skills;