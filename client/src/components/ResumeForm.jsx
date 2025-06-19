// client/src/components/ResumeForm.jsx

import { useState } from "react";
import axios from "axios";
import { Sparkles, PlusCircle, Trash2, X } from 'lucide-react';

const API_URL = 'http://localhost:5001/api';

const ResumeForm = ({ resumeData, setResumeData }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSkill, setCurrentSkill] = useState("");

  // --- GENERIC CHANGE HANDLER ---
  // Handles changes for simple fields (like personal info and summary)
  const handleChange = (e, section) => {
    const { name, value } = e.target;
    setResumeData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [name]: value,
      },
    }));
  };

  // --- EDUCATION HANDLERS ---
  // Handles changes for fields within the education list
  const handleEducationChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...resumeData.education];
    list[index][name] = value;
    setResumeData({ ...resumeData, education: list });
  };

  // Adds a new, empty education entry
  const addEducation = () => {
    setResumeData(prevData => ({
      ...prevData,
      education: [...prevData.education, { school: '', degree: '', gradYear: '' }],
    }));
  };
  
  // Removes an education entry by its index
  const removeEducation = (index) => {
    const list = [...resumeData.education];
    list.splice(index, 1);
    setResumeData({ ...resumeData, education: list });
  };

 // --- SKILLS HANDLERS ---
  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' && currentSkill.trim() !== '') {
      e.preventDefault();
      if (!resumeData.skills.includes(currentSkill.trim())) {
        setResumeData(prevData => ({ ...prevData, skills: [...prevData.skills, currentSkill.trim()] }));
      }
      setCurrentSkill(""); // Clear the input
    }
  };
  const removeSkill = (skillToRemove) => {
    setResumeData(prevData => ({
      ...prevData,
      skills: prevData.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  // --- PROJECTS HANDLERS ---
  const handleProjectChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...resumeData.projects];
    list[index][name] = value;
    setResumeData({ ...resumeData, projects: list });
  };
  const addProject = () => setResumeData(prevData => ({
    ...prevData,
    projects: [...prevData.projects, { name: '', description: '', link: '' }],
  }));
  const removeProject = (index) => {
    const list = [...resumeData.projects];
    list.splice(index, 1);
    setResumeData({ ...resumeData, projects: list });
  };

// --- EXPERIENCE HANDLERS (NEW) ---
const handleExperienceChange = (e, index) => {
  const { name, value } = e.target;
  const list = [...resumeData.experience];
  list[index][name] = value;
  setResumeData({ ...resumeData, experience: list });
};

const addExperience = () => {
  setResumeData(prevData => ({
    ...prevData,
    experience: [
      ...prevData.experience,
      { jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: '' }
    ],
  }));
};

const removeExperience = (index) => {
  const list = [...resumeData.experience];
  list.splice(index, 1);
  setResumeData({ ...resumeData, experience: list });
};


  // --- AI SUGGESTIONS ---
  const getAISuggestions = async (field, value) => {
    if (!value.trim()) return;
    setIsLoading(true);
    setSuggestions([]);
    try {
      const response = await axios.post(`${API_URL}/ai/suggest`, { field, value });
      setSuggestions(response.data.suggestions || []);
    } catch (err) {
      console.error('Error getting AI suggestions:', err);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <form className="space-y-8">
      {/* Personal Information Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="fullName"
            className="p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Full Name"
            value={resumeData.personalInfo.fullName}
            onChange={(e) => handleChange(e, 'personalInfo')}
          />
          <input
            type="email"
            name="email"
            className="p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Email Address"
            value={resumeData.personalInfo.email}
            onChange={(e) => handleChange(e, 'personalInfo')}
          />
          <input
            type="tel"
            name="phone"
            className="p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Phone Number"
            value={resumeData.personalInfo.phone}
            onChange={(e) => handleChange(e, 'personalInfo')}
          />
          <input
            type="text"
            name="address"
            className="p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="City, State"
            value={resumeData.personalInfo.address}
            onChange={(e) => handleChange(e, 'personalInfo')}
          />
        </div>
      </div>

      {/* Summary Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Professional Summary</h3>
        <div className="relative">
          <textarea
            name="summary"
            rows="5"
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="A brief overview of your career..."
            value={resumeData.summary}
            onChange={(e) => setResumeData({...resumeData, summary: e.target.value})}
          />
          <button
            type="button"
            onClick={() => getAISuggestions('summary', resumeData.summary)}
            disabled={isLoading}
            className="absolute top-2 right-2 p-1.5 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 disabled:opacity-50"
            title="Get AI Suggestions"
          >
            <Sparkles size={18} />
          </button>
        </div>
        {/* ... (AI suggestion box code remains the same) ... */}
      </div>

{/* --- Work Experience / Internship Section (NEW) --- */}
<div>
  <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Work Experience / Internship</h3>
  {resumeData.experience.map((exp, index) => (
    <div key={index} className="p-4 mb-4 border border-gray-200 rounded-lg relative space-y-3">
       <button
        type="button"
        onClick={() => removeExperience(index)}
        className="absolute top-4 right-2 p-2 text-red-500 hover:text-red-700"
        title="Remove Experience"
      >
        <Trash2 size={19} />
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="jobTitle" className="p-2 border border-gray-300 rounded-md shadow-sm w-75" placeholder="Job Title" value={exp.jobTitle} onChange={(e) => handleExperienceChange(e, index)} />
          <input type="text" name="company" className="p-2 border border-gray-300 rounded-md shadow-sm w-73" placeholder="Company" value={exp.company} onChange={(e) => handleExperienceChange(e, index)} />
          <input type="text" name="location" className="p-2 border border-gray-300 rounded-md shadow-sm w-75" placeholder="Location (e.g., Remote)" value={exp.location} onChange={(e) => handleExperienceChange(e, index)} />
          <div className="grid grid-cols-2 gap-2">
              <input type="text" name="startDate" className="p-2 border border-gray-300 rounded-md shadow-sm" placeholder="Start Date" value={exp.startDate} onChange={(e) => handleExperienceChange(e, index)} />
              <input type="text" name="endDate" className="p-2 border border-gray-300 rounded-md shadow-sm" placeholder="End Date" value={exp.endDate} onChange={(e) => handleExperienceChange(e, index)} />
          </div>
      </div>
      <textarea name="description" rows="4" className="w-full p-2 border border-gray-300 rounded-md shadow-sm" placeholder="Describe your responsibilities and achievements..." value={exp.description} onChange={(e) => handleExperienceChange(e, index)} />
    </div>
  ))}
  <button type="button" onClick={addExperience} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
    <PlusCircle size={20} />
    Add Experience
  </button>
</div>

      {/* Education Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Education</h3>
        {resumeData.education.map((edu, index) => (
          <div key={index} className="p-4 mb-4 border border-gray-200 rounded-lg relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="school"
                className="p-2 border border-gray-300 rounded-md shadow-sm w-75"
                placeholder="School / University"
                value={edu.school}
                onChange={(e) => handleEducationChange(e, index)}
              />
              <input
                type="text"
                name="degree"
                className="p-2 border border-gray-300 rounded-md shadow-sm w-75"
                placeholder="Degree Name / Field of Study"
                value={edu.degree}
                onChange={(e) => handleEducationChange(e, index)}
              />
              <input
                type="text"
                name="gradYear"
                className="p-2 border border-gray-300 rounded-md shadow-sm w-75"
                placeholder="Graduation Year"
                value={edu.gradYear}
                onChange={(e) => handleEducationChange(e, index)}
              />
            </div>
            {resumeData.education.length > 1 && (
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="absolute top-4 right-1 p-2 text-red-500 hover:text-red-700"
                title="Remove Education"
              >
                <Trash2 size={19} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addEducation}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <PlusCircle size={20} />
          Add Education
        </button>
      </div>

 {/* --- Skills Section (NEW) --- */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Skills</h3>
        <div className="p-2 border border-gray-300 rounded-md flex flex-wrap gap-2 mb-2">
          {resumeData.skills.map((skill, index) => (
            <span key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {skill}
              <button type="button" onClick={() => removeSkill(skill)} className="text-blue-600 hover:text-blue-800">
                <X size={14} />
              </button>
            </span>
          ))}
          <input
            type="text"
            className="flex-grow p-1 outline-none"
            placeholder="Add a skill and press Enter..."
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            onKeyDown={handleSkillKeyDown}
          />
        </div>
      </div>

      {/* --- Projects Section (NEW) --- */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Projects</h3>
        {resumeData.projects.map((proj, index) => (
          <div key={index} className="p-4 mb-4 border border-gray-200 rounded-lg relative space-y-3">
            <button
              type="button"
              onClick={() => removeProject(index)}
              className="absolute top-5 right-2 p-2 text-red-500 hover:text-red-700"
              title="Remove Project"
            >
              <Trash2 size={19} />
            </button>
            <input
              type="text"
              name="name"
              className="p-2 border border-gray-300 rounded-md shadow-sm w-xl"
              placeholder="Project Name"
              value={proj.name}
              onChange={(e) => handleProjectChange(e, index)}
            />
            <textarea
              name="description"
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Project Description"
              value={proj.description}
              onChange={(e) => handleProjectChange(e, index)}
            />
            <input
              type="text"
              name="link"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Project Link (optional)"
              value={proj.link}
              onChange={(e) => handleProjectChange(e, index)}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addProject}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <PlusCircle size={20} />
          Add Project
        </button>
      </div>

     
   

    </form>
  );
};

export default ResumeForm;