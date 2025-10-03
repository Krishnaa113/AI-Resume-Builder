import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { useContext, useEffect, useState } from 'react';
import { LoaderCircle, Upload, X, FileText, Award } from 'lucide-react';
import { ResumeInfoContext } from '../../../../../../context/ResumeInfoContext';
import GlobalAPi from '../../../../../../../service/GlobalAPi';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

function Certificate({enableNext}) {
   const [loading,setLoading]=useState(false);
   const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext);
   const params=useParams();
   
  const [certificateList,setCertificateList]=useState(
    [
      {
        certificateName:'',
        issuingOrganization:'',
        issueDate:'',
        expiryDate:'',
        credentialId:'',
        credentialUrl:'',
        file:null
      }
    ]
  )
  
  const handleChange=(event,index)=>{
    enableNext(false);
    const { name, value } = event.target;
    const updatedList = [...certificateList];
    updatedList[index] = {
      ...updatedList[index],
      [name]: value
    };
    setCertificateList(updatedList);
  }

  const handleFileChange = (event, index) => {
    enableNext(false);
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      
      // Check file type (PDF, PNG, JPG, JPEG)
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload PDF, PNG, or JPG files only");
        return;
      }

      const updatedList = [...certificateList];
      updatedList[index] = {
        ...updatedList[index],
        file: file
      };
      setCertificateList(updatedList);
    }
  }
  
  const AddNewCertificate=()=>{
    setCertificateList([...certificateList, {
      certificateName:'',
      issuingOrganization:'',
      issueDate:'',
      expiryDate:'',
      credentialId:'',
      credentialUrl:'',
      file:null
    }]);
  }
  
   const RemoveCertificate=(index)=>{
    if (certificateList.length > 1) {
      const updatedList = certificateList.filter((_, i) => i !== index);
      setCertificateList(updatedList);
    }
  }

  const removeFile = (index) => {
    const updatedList = [...certificateList];
    updatedList[index] = {
      ...updatedList[index],
      file: null
    };
    setCertificateList(updatedList);
  }

  useEffect(()=>{
    setResumeInfo({
      ...resumeInfo,
      certificates:certificateList
    })
  },[certificateList])

  const onSave=(e)=>{
    e.preventDefault();
    setLoading(true);
    
    // Check if certificateList exists and has data
    if (!certificateList || certificateList.length === 0) {
        toast("Please add at least one certificate entry");
        setLoading(false);
        return;
    }
    
    const data={
        certificates:certificateList
    }
    console.log("Sending certificate data to API:", data);
    console.log("Resume ID:", params?.resumeId);
    
    GlobalAPi.UpdateResumeDetail(params?.resumeId,data)
    .then(resp=>{
          console.log("API Response:", resp);
          enableNext(true);
          setLoading(false);
          toast("Certificates updated successfully");
      },(error)=>{
           console.error("Error saving certificates:", error);
           console.error("Error response:", error.response);
           console.error("Error status:", error.response?.status);
           console.error("Error data:", error.response?.data);
           setLoading(false);
           toast("Error saving certificate data");
           }
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white/70 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
          <Award className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-extrabold text-2xl text-gray-900">Certificates & Credentials</h2>
          <p className="text-gray-600">Add your professional certifications and achievements</p>
        </div>
      </div>

      <form onSubmit={onSave} className="space-y-8">
        <div className="space-y-6">
          {certificateList.map((item,index)=>(
             <div key={index} className="relative group border border-white/20 bg-white/60 backdrop-blur rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Certificate Name</label>
                  <Input 
                    name="certificateName" 
                    value={item.certificateName}
                    onChange={(e)=>handleChange(e,index)}
                    placeholder="e.g., AWS Certified Solutions Architect"
                    className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500/60 transition-all"
                  />
                </div>
                <div>
                   <label className="block text-gray-700 font-medium mb-2">Issuing Organization</label>
                  <Input 
                    name="issuingOrganization" 
                    value={item.issuingOrganization}
                    onChange={(e)=>handleChange(e,index)}
                    placeholder="e.g., Amazon Web Services"
                    className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Issue Date</label>
                  <Input 
                    type="date"
                    name="issueDate" 
                    value={item.issueDate}
                    onChange={(e)=>handleChange(e,index)}
                    className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Expiry Date (Optional)</label>
                  <Input 
                    type="date"
                    name="expiryDate" 
                    value={item.expiryDate}
                    onChange={(e)=>handleChange(e,index)}
                    className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Credential ID (Optional)</label>
                  <Input 
                    name="credentialId" 
                    value={item.credentialId}
                    onChange={(e)=>handleChange(e,index)}
                    placeholder="e.g., AWS-123456"
                    className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Credential URL (Optional)</label>
                  <Input 
                    name="credentialUrl" 
                    value={item.credentialUrl}
                    onChange={(e)=>handleChange(e,index)}
                    placeholder="https://verify.aws.com/..."
                    className="bg-white/80 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500/60 transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Certificate File (PDF, PNG, JPG - Max 5MB)</label>
                  <div className='mt-2'>
                    {item.file ? (
                      <div className='flex items-center gap-3 p-4 border border-green-200 rounded-lg bg-green-50'>
                        <FileText className='w-5 h-5 text-green-600' />
                        <span className='text-sm font-medium text-green-800'>{item.file.name}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeFile(index)}
                          className='ml-auto hover:bg-green-100'
                        >
                          <X className='w-4 h-4 text-green-600' />
                        </Button>
                      </div>
                    ) : (
                      <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors duration-200'>
                        <Upload className='w-8 h-8 mx-auto mb-3 text-gray-400' />
                        <Input 
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e)=>handleFileChange(e,index)}
                          className='hidden'
                          id={`file-${index}`}
                        />
                        <label 
                          htmlFor={`file-${index}`}
                          className='cursor-pointer text-green-600 hover:text-green-800 font-medium'
                        >
                          Click to upload certificate
                        </label>
                        <p className='text-xs text-gray-500 mt-2'>
                          PDF, PNG, JPG up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
               </div>
               <div className="flex gap-3 mt-4">
                 <Button type="button" variant="outline" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-md hover:scale-105 active:scale-95 transition-all w-20" onClick={AddNewCertificate}>Add More Certificates</Button>
                 <Button type="button" variant="outline" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-md hover:scale-105 active:scale-95 transition-all w-15" onClick={() => RemoveCertificate(index)} disabled={certificateList.length === 1}>Remove</Button>
               </div>
             </div>
          ))}
        </div>
        <div className=" bottom-0 bg-transparent pt-4 flex justify-end z-10">
          <Button 
            type="submit" 
            disabled={loading} 
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            {loading ? <LoaderCircle className="animate-spin" /> : "Save Certificates"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Certificate 