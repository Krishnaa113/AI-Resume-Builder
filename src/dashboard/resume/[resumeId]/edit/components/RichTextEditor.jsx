import React, { useCallback, useMemo } from 'react';
import { BtnBold, BtnBulletList, BtnClearFormatting, BtnItalic,BtnLink,BtnNumberedList,BtnStrikeThrough,BtnStyles,BtnUnderline,Editor, EditorProvider, HtmlButton, Separator, Toolbar } from 'react-simple-wysiwyg';
import {useState,useContext} from 'react';
import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { toast } from 'sonner';
import { createChatSession } from '../../../../../../service/AIModals';
import { LoaderCircle } from 'lucide-react';


const PROMPT = `Based on the position title "{positionTitle}", generate 5-7 professional experience bullet points in HTML format with the following structure:

<ul>
<li>Point 1: Key achievement or responsibility</li>
<li>Point 2: Technical skill or project</li>
<li>Point 3: Leadership or collaboration</li>
<li>Point 4: Results or impact</li>
<li>Point 5: Additional responsibility</li>
</ul>

Please provide experience points that:
- Use action verbs and professional language
- Highlight quantifiable achievements when possible
- Are relevant to the specific position title
- Follow resume best practices
- Are concise and impactful`;
function RichTextEditor({onRichTextEditorChange,index}) {
const [value,setValue]=useState('');
const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext);
const [loading,setLoading]=useState(false);

// Function to clean existing content from JSON formatting
const cleanExistingContent = useCallback((content) => {
  if (!content) return '';
  
  let cleaned = content;
  
  // Remove JSON formatting patterns
  cleaned = cleaned.replace(/\{"bulletPoints":\s*\{[^}]*"\s*:\s*"/g, '');
  cleaned = cleaned.replace(/\{"point":\s*"/g, '');
  cleaned = cleaned.replace(/\{"html":\s*"/g, '');
  cleaned = cleaned.replace(/"\s*\}\s*\}/g, '');
  cleaned = cleaned.replace(/"\s*\}\s*$/g, '');
  
  // Remove other unwanted patterns
  cleaned = cleaned.replace(/^Here are.*?:\s*/i, '');
  cleaned = cleaned.replace(/^Based on.*?:\s*/i, '');
  cleaned = cleaned.replace(/^For.*?:\s*/i, '');
  cleaned = cleaned.replace(/^As.*?:\s*/i, '');
  cleaned = cleaned.replace(/^The.*?:\s*/i, '');
  cleaned = cleaned.replace(/```html/g, '');
  cleaned = cleaned.replace(/```/g, '');
  cleaned = cleaned.replace(/\[.*?\]/g, '');
  
  return cleaned.trim();
}, []);

const GenerateSummeryFromAI = useCallback(async () => {
  setLoading(true);
  if(!resumeInfo.experience[index].title){
    toast('Please Add Position Title');
    setLoading(false);
    return;
  }
  try {
    const prompt=PROMPT.replace('{positionTitle}',resumeInfo.experience[index].title);
    const session = await createChatSession();
    const result = await session.sendMessage(prompt);
    const resp=result.response.text();
    
    // Clean the AI response to remove unwanted formatting
    let cleanedValue = resp;
    
    // Remove JSON formatting patterns
    cleanedValue = cleanedValue.replace(/\{"bulletPoints":\s*\{[^}]*"\s*:\s*"/g, '');
    cleanedValue = cleanedValue.replace(/\{"point":\s*"/g, '');
    cleanedValue = cleanedValue.replace(/\{"html":\s*"/g, '');
    cleanedValue = cleanedValue.replace(/"\s*\}\s*\}/g, '');
    cleanedValue = cleanedValue.replace(/"\s*\}\s*$/g, '');
    
    // Remove common unwanted prefixes
    cleanedValue = cleanedValue.replace(/^Here are.*?:\s*/i, '');
    cleanedValue = cleanedValue.replace(/^Based on.*?:\s*/i, '');
    cleanedValue = cleanedValue.replace(/^For.*?:\s*/i, '');
    cleanedValue = cleanedValue.replace(/^As.*?:\s*/i, '');
    cleanedValue = cleanedValue.replace(/^The.*?:\s*/i, '');
    
    // Remove markdown code blocks
    cleanedValue = cleanedValue.replace(/```html/g, '');
    cleanedValue = cleanedValue.replace(/```/g, '');
    
    // Remove square brackets and their content
    cleanedValue = cleanedValue.replace(/\[.*?\]/g, '');
    
    // Remove extra whitespace and normalize
    cleanedValue = cleanedValue.trim();
    cleanedValue = cleanedValue.replace(/\n\s*\n/g, '\n');
    
    // Ensure we have proper HTML structure
    if (!cleanedValue.includes('<ul>') && !cleanedValue.includes('<li>')) {
      // If no HTML structure, try to extract bullet points
      const lines = cleanedValue.split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        cleanedValue = '<ul>\n' + lines.map(line => {
          const cleanLine = line.replace(/^[-•*]\s*/, '').trim();
          return cleanLine ? `<li>${cleanLine}</li>` : '';
        }).filter(line => line).join('\n') + '\n</ul>';
      }
    }
    
    setValue(cleanedValue);
    // Also update parent so it is saved and shown in preview
    if (onRichTextEditorChange) {
      // Simulate a synthetic event with the new value
      onRichTextEditorChange({ target: { value: cleanedValue } });
    }
    
    toast.success("AI content generated successfully!");
  } catch (error) {
    let errorMsg = "Failed to generate summary from AI. Please try again.";
    if (error && error.message) errorMsg += `\n${error.message}`;
    if (error && error.response && error.response.text) {
      try {
        errorMsg += `\n${await error.response.text()}`;
      } catch {}
    }
    toast.error(errorMsg);
    console.error("AI error:", error);
  }
  setLoading(false);
}, [resumeInfo.experience, index, onRichTextEditorChange]); 

  // Memoize the clean content handler
  const handleCleanContent = useCallback(() => {
    const cleaned = cleanExistingContent(value);
    setValue(cleaned);
    if (onRichTextEditorChange) {
      onRichTextEditorChange({ target: { value: cleaned } });
    }
    toast.success("Content cleaned successfully!");
  }, [cleanExistingContent, value, onRichTextEditorChange]);

  return (
    <div>
      <div className='flex justify-between my-2'>
         <div className='flex gap-2'>
           <Button 
             variant='outline' 
             size='sm'
             onClick={GenerateSummeryFromAI}
             className='flex gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-2 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all'>
             {
             loading?<LoaderCircle className='animate-spin '/>:
             <>Generate From AI</>
             }
           </Button>
         </div>
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