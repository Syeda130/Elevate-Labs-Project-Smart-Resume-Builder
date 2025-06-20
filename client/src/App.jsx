import { useState } from 'react';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import { Download } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

function App() {
  const [resumeData, setResumeData] = useState({
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: ''
  },
  summary: '',
  education: [
    {
      school: '',
      degree: '',
      gradYear: ''
    }
  ],
  skills: [], 
  projects: [
    {
      name: '',
      description: '',
      link: ''
    }
  ],
   experience: [ 
    {
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    }
  ],
});

// PDF export
const handleExportPDF = () => {
  window.print();
};

  //  handleSaveResume function ---
  const handleSaveResume = async () => {
    try {
      // Send the entire resumeData object to your backend's /api/resume endpoint
      const response = await axios.post(`${API_URL}/resume`, resumeData);
      console.log('Resume saved successfully:', response.data);
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Error saving resume:', error.response ? error.response.data : error.message);
      alert('Failed to save resume. Check console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-slate-800 shadow-md p-4 hide-on-print">
        <h1 className="text-3xl font-bold text-stone-50 text-center">Smart Resume Builder</h1>
        <p className="text-center text-stone-400">Create a professional resume with AI-powered suggestions.</p>
      </header>
      
      <main className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-stone-200 p-6 rounded-lg shadow-lg hide-on-print">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">Editor</h2>
            <button
              onClick={handleSaveResume}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 ml-80"
            >
              Save Resume
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              <Download size={18} />
              Export as PDF
            </button>
          </div>
          <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
        </div>

       <div className="bg-stone-200 p-6 rounded-lg shadow-lg">
   <h2 className="text-2xl font-semibold text-gray-700 mb-4">Preview</h2>
   <div id="resume-preview">
      <ResumePreview resumeData={resumeData} />
   </div>
</div>
      </main>
    </div>



  );
}

export default App;
