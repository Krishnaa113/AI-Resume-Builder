import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { ResumeInfoContext } from '../../../../../../context/ResumeInfoContext';
import GlobalAPi from '../../../../../../../service/GlobalAPi';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

function Education({enableNext}) {
   const [loading,setLoading]=useState(false);
   const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext);
   const params=useParams();
   
  const [educationList,setEducationList]=useState(
    [
      {
        universityName:'',
        degree:'',
        major:'',
        startDate:'',
        endDate:'',
        description:''
      }
    ]
  )
  
  const handleChange=(event,index)=>{
    enableNext(false);
    const { name, value } = event.target;
    const updatedList = [...educationList];
    updatedList[index] = {
      ...updatedList[index],
      [name]: value
    };
    setEducationList(updatedList);
  }
  
  const AddNewEducation=()=>{
    setEducationList([...educationList, {
      universityName:'',
      degree:'',
      major:'',
      startDate:'',
      endDate:'',
      description:''
    }]);
  }
  
   const RemoveEducation=(index)=>{
    if (educationList.length > 1) {
      const updatedList = educationList.filter((_, i) => i !== index);
      setEducationList(updatedList);
    }
  }

  useEffect(()=>{
    setResumeInfo({
      ...resumeInfo,
      education:educationList
    })
  },[educationList])

  const onSave=(e)=>{
    e.preventDefault();
    setLoading(true);
    
    // Check if educationList exists and has data
    if (!educationList || educationList.length === 0) {
        toast("Please add at least one education entry");
        setLoading(false);
        return;
    }
    
    const data={
        education:educationList
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
           console.error("Error saving education:", error);
           console.error("Error response:", error.response);
           console.error("Error status:", error.response?.status);
           console.error("Error data:", error.response?.data);
           setLoading(false);
           toast("Error saving education data");
           }
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white/70 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl animate-in fade-in duration-500">
      <h2 className="font-extrabold text-2xl text-gray-900 mb-1">Education</h2>
      <p className="text-gray-600 mb-6">Add your education details</p>
      <form onSubmit={onSave} className="space-y-8">
        <div className="space-y-8">
          {educationList.map((item, index) => (
            <div key={index} className="relative group border border-white/20 bg-white/60 backdrop-blur rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">University Name</label>
                  <Input
                    name="universityName"
                    value={item.universityName}
                    onChange={(e) => handleChange(e, index)}
                    className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Degree</label>
                  <Input
                    name="degree"
                    value={item.degree}
                    onChange={(e) => handleChange(e, index)}
                    className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Major</label>
                  <Input
                    name="major"
                    value={item.major}
                    onChange={(e) => handleChange(e, index)}
                    className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Start Date</label>
                  <Input
                    name="startDate"
                    value={item.startDate}
                    onChange={(e) => handleChange(e, index)}
                    className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">End Date</label>
                  <Input
                    name="endDate"
                    value={item.endDate}
                    onChange={(e) => handleChange(e, index)}
                    className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/60 transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-1">Description</label>
                  <Textarea
                    name="description"
                    value={item.description}
                    onChange={(e) => handleChange(e, index)}
                    className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/60 transition-all min-h-[60px]"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button type="button" variant="outline" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md hover:scale-105 active:scale-95 transition-all" onClick={AddNewEducation}>+ Add More</Button>
                <Button type="button" variant="outline" className="bg-red-500/90 text-white font-semibold shadow-md hover:scale-105 active:scale-95 transition-all" onClick={() => RemoveEducation(index)} disabled={educationList.length === 1}>- Remove</Button>
              </div>
            </div>
          ))}
        </div>
        <div className="sticky bottom-0 bg-transparent pt-4 flex justify-end z-10">
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

export default Education