import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, PlusSquare } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from "../../components/ui/button";
import { Input } from "@/components/ui/input"
import { v4 as uuidv4 } from 'uuid';
import GlobalAPi from "./../../../service/GlobalAPi";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function AddResume({ onResumeCreated }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onCreate = async () => {
    if (!resumeTitle.trim()) {
      toast.error("Please enter a resume title");
      return;
    }
    
    setLoading(true);
    const uuid = uuidv4();

    const data = {
      data: {
        title: resumeTitle.trim(),
        resumeId: uuid,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName
      }
    }
    
    try {
      const resp = await GlobalAPi.CreateNewResume(data);
      if (resp && resp.data && resp.data.data && resp.data.data.documentId) {
        setLoading(false);
        setOpenDialog(false);
        setResumeTitle('');
        toast.success("Resume created successfully!");
        if (onResumeCreated) {
          onResumeCreated();
        }
        navigate("/dashboard/resume/" + resp.data.data.documentId + "/edit");
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error creating resume. Please try again.");
    }
  };

  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <div className="h-[300px] bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:border-blue-400 hover:shadow-lg">
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              size="lg"
            >
              <PlusSquare className="w-6 h-6 mr-3" />
              Create New Resume
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-2xl p-8 z-[1000]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Create New Resume
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Give your resume a meaningful title to help you organize your documents.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume Title
              </label>
              <Input 
                placeholder="e.g., Software Engineer Resume" 
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="w-full"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    onCreate();
                  }
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                You can always change this later
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setOpenDialog(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                onClick={onCreate}
                disabled={!resumeTitle.trim() || loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <PlusSquare className="w-4 h-4 mr-2" />
                    Create Resume
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddResume;