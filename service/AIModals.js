import { GoogleGenerativeAI } from "@google/generative-ai";


const apiKey=import.meta.env.VITE_GOOGLE_API_KEY;
const genAI=new GoogleGenerativeAI(apiKey);

const model=genAI.getGenerativeModel({
    model:"gemini-1.5-flash",
});

const generationConfig={
     temperature:0.7,
     topP:0.9,
     topK:40,
     maxOutputTokens:2048,
     responseMimeType:"application/json",
    };

export async function createChatSession() {
  return await model.startChat({
    generationConfig,
    history: [],
  });
}
