import axios from "axios";

// Mock API for testing without Strapi
const MOCK_MODE = true; // Set to false when you have Strapi running

// Load your API key (from .env file)
const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;

// Create a reusable axios client for Strapi
const axiosClient = axios.create({
  baseURL: 'http://localhost:1337/api/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  },
});

// Mock data storage with localStorage persistence
let mockResumes = JSON.parse(localStorage.getItem('mockResumes')) || [];
let mockResumeId = parseInt(localStorage.getItem('mockResumeId')) || 1;

// ✅ Create a new resume (POST)
const CreateNewResume = async (data) => {
  if (MOCK_MODE) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newResume = {
      id: mockResumeId++,
      documentId: data.data.resumeId,
      title: data.data.title,
      userEmail: data.data.userEmail,
      userName: data.data.userName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockResumes.push(newResume);
    
    // Save to localStorage
    localStorage.setItem('mockResumes', JSON.stringify(mockResumes));
    localStorage.setItem('mockResumeId', mockResumeId.toString());
    
    return {
      data: {
        data: {
          documentId: newResume.documentId,
          id: newResume.id
        }
      }
    };
  } else {
    return axiosClient.post('/user-resumes', { data });
  }
};

// ✅ Get all resumes for a user (GET)
const GetUserResumes = async (userEmail) => {
  if (MOCK_MODE) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userResumes = mockResumes.filter(resume => resume.userEmail === userEmail);
    
    return {
      data: {
        data: userResumes
      }
    };
  } else {
    return axiosClient.get('/user-resumes?filters[userEmail][$eq]=' + userEmail);
  }
};

// ✅ Update a resume by ID (PUT)
const UpdateResumeDetail = async (id, data) => {
  if (MOCK_MODE) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const resumeIndex = mockResumes.findIndex(resume => resume.documentId === id);
    if (resumeIndex !== -1) {
      mockResumes[resumeIndex] = {
        ...mockResumes[resumeIndex],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('mockResumes', JSON.stringify(mockResumes));
    }
    
    return {
      data: {
        data: mockResumes[resumeIndex] || {}
      }
    };
  } else {
    return axiosClient.put('/user-resumes/' + id, { data });
  }
};

// ✅ Delete a resume by ID (DELETE)
const DeleteResume = async (id) => {
  if (MOCK_MODE) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const resumeIndex = mockResumes.findIndex(resume => resume.documentId === id);
    if (resumeIndex !== -1) {
      mockResumes.splice(resumeIndex, 1);
      
      // Save to localStorage
      localStorage.setItem('mockResumes', JSON.stringify(mockResumes));
    }
    
    return {
      data: {
        success: true
      }
    };
  } else {
    return axiosClient.delete('/user-resumes/' + id);
  }
};

export default {
  CreateNewResume,
  GetUserResumes,
  UpdateResumeDetail,
  DeleteResume,
}; 