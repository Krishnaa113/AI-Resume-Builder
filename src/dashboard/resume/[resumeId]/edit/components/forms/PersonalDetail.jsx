import React, { useContext, useEffect, useState } from 'react'
import { ResumeInfoContext } from '../../../../../../context/ResumeInfoContext'
import {Input} from '@/components/ui/input'
import { Button } from '../../../../../../components/ui/button';
import { useParams } from 'react-router-dom';
import GlobalAPi from '../../../../../../../service/GlobalAPi';
import { LoaderCircle } from 'lucide-react';
import { toast } from "sonner";

function PersonalDetail({enableNext}) {

    const params = useParams();
    const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext);
    const [formData,setFormData]=useState();
    const [loading,setLoading]=useState(false);

     useEffect(()=>{
        console.log(params)
     },[])


    const handleInputChange=(e)=>{
        enableNext(false);
      const {name,value}=e.target;

      setFormData({
         ...formData,
         [name]:value
      })

        setResumeInfo({
            ...resumeInfo,
            [name]:value
        })

    }
    const onSave=(e)=>{
       e.preventDefault();
       setLoading(true);
       const data=formData;
       GlobalAPi.UpdateResumeDetail(params?.resumeId,data).then(resp=>{
        console.log(resp);
        enableNext(true);
        setLoading(false);
        toast("Updated");
       },(error)=>{
        setLoading(false);
       })
       
    }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white/70 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl animate-in fade-in duration-500">
      <h2 className="font-extrabold text-2xl text-gray-900 mb-1">Personal Details</h2>
      <p className="text-gray-600 mb-6">Get started with your information</p>
      <form onSubmit={onSave} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">First Name</label>
            <Input name="firstName" defaultValue={resumeInfo?.firstName} required onChange={handleInputChange} className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/60 transition-all" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Last Name</label>
            <Input name="lastName" defaultValue={resumeInfo?.lastName} required onChange={handleInputChange} className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/60 transition-all" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Job Title</label>
            <Input name="jobTitle" defaultValue={resumeInfo?.jobTitle} required onChange={handleInputChange} className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/60 transition-all" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Address</label>
            <Input name="address" defaultValue={resumeInfo?.address} required onChange={handleInputChange} className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/60 transition-all" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone</label>
            <Input name="phone" defaultValue={resumeInfo?.phone} required onChange={handleInputChange} className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/60 transition-all" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <Input name="email" defaultValue={resumeInfo?.email} required onChange={handleInputChange} className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/60 transition-all" />
          </div>
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

export default PersonalDetail