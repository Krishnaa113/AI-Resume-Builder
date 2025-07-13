import React from 'react';
import { BtnBold, BtnBulletList, BtnClearFormatting, BtnItalic,BtnLink,BtnNumberedList,BtnStrikeThrough,BtnStyles,BtnUnderline,Editor, EditorProvider, HtmlButton, Separator, Toolbar } from 'react-simple-wysiwyg';
import {useState,useContext} from 'react';
import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { toast } from 'sonner';
import { createChatSession } from '../../../../../../service/AIModals';
import { LoaderCircle } from 'lucide-react';


const PROMPT=' {positionTitle} , Depend on the position title give me 5-7 for my experience in resume, give me result in html form'
function RichTextEditor({onRichTextEditorChange,index}) {
const [value,setValue]=useState('');
const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext);
const [loading,setLoading]=useState(false);

const GenerateSummeryFromAI=async()=>{
  setLoading(true);
  if(!resumeInfo.experience[index].title){
    toast('Please Add Position Title');
    return;
  }
  const prompt=PROMPT.replace('{positionTitle}',resumeInfo.experience[index].title);
  const session = await createChatSession();
  const result = await session.sendMessage(prompt);
  console.log(result.response.text()); 
  const resp=result.response.text();
  setValue(resp.replace('[','').replace(']',''));
  setLoading(false);
} 

  return (
    <div>
      <div className='flex justify-between my-2'>
         <label className='text-sm'>Summery</label>
         <Button variant='outline' size='sm'
         onClick={GenerateSummeryFromAI}
         className='flex  gap-2 border-black text-black'>
         {
         loading?<LoaderCircle className='animate-spin'/>:
         <>Generate From AI</>
         }
         </Button>
      </div>
        <EditorProvider>
            <Editor value={value} onChange={(e)=>{
                setValue(e.target.value);
                onRichTextEditorChange(e);
            }}>
               <Toolbar>
                 <BtnBold/>
                 <BtnItalic/>
                 <BtnUnderline/>
                 <BtnStrikeThrough/>
                 <Separator/>
                 <BtnNumberedList/>
                 <BtnBulletList/>
                 <Separator/>
                 <BtnStyles/> 
               </Toolbar>
            </Editor>
        </EditorProvider>
    </div>
  )
}

export default RichTextEditor