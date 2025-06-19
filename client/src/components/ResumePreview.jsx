
import { Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';

const ResumePreview = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, projects } = resumeData;

  // Reusable Section component for consistent styling
  const Section = ({ title, children }) => (
    <div className="mt-4">
      <h2 className="text-lg font-bold border-b border-gray-400 pb-1 mb-2 tracking-wide uppercase">{title}</h2>
      {children}
    </div>
  );

  return (
    
    <div className="p-6 bg-white shadow-lg font-serif text-gray-800 text-sm">
      {/* Header */}
      <div className="text-center border-b-2 pb-2 border-gray-500">
        <h1 className="text-3xl font-bold tracking-wider">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <div className="flex justify-center items-center flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-gray-600 font-sans">
          {personalInfo.email && <span className="flex items-center gap-1.5"><Mail size={12} /> {personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1.5"><Phone size={12} /> {personalInfo.phone}</span>}
          {personalInfo.address && <span className="flex items-center gap-1.5"><MapPin size={12} /> {personalInfo.address}</span>}
          {personalInfo.linkedin && <span className="flex items-center gap-1.5"><LinkIcon size={12} /> {personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      <Section title="Summary">
        <p className="leading-normal mb-4 text-gray-700 text-xs">{summary || 'Write a brief professional summary...'}</p>
      </Section>
      
      {/* Experience */}
      {experience && experience.length > 0 && (
        <Section title="Experience / Internships">
          {experience.map((exp, index) => (
            <div key={index} className="mb-3 mt-2">
              <div className="flex justify-between items-end">
                <p className="font-bold text-base text-gray-700">{exp.jobTitle || 'Job Title'}</p>
                <p className="text-xs text-gray-600 font-sans">{exp.startDate || 'Start Date'} - {exp.endDate || 'End Date'}</p>
              </div>
              <div className="flex justify-between items-end italic">
                  <p className="text-md text-gray-700">{exp.company || 'Company Name'}</p>
                  <p className="text-xs text-gray-600 font-sans">{exp.location || 'Location'}</p>
              </div>
              {/* Using whitespace-pre-wrap to respect line breaks from the textarea */}
              <p className="mt-1 leading-normal whitespace-pre-wrap mb-3 text-gray-700 text-xs">{exp.description || 'Description of responsibilities and achievements.'}</p>
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      <Section title="Education">
        {education.map((edu, index) => (
          <div key={index} className="mb-2">
            <div className="flex justify-between items-end">
                <p className="font-bold text-gray-700">{edu.degree || 'Degree / Field of Study'}</p>
                <p className="text-xs text-gray-600 font-sans">{edu.gradYear || 'Graduation Year'}</p>
            </div>
            <p className="italic mb-3 text-gray-700 text-xs">{edu.school || 'School / University'}</p>
          </div>
        ))}
      </Section>

      {/* Projects */}
      <Section title="Projects">
        {projects.map((proj, index) => (
          <div key={index} className="mb-2">
            <div className="flex items-center justify-between">
              <p className="font-bold text-gray-700">{proj.name || 'Project Name'}</p>
              {proj.link && (
                <a href={proj.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline font-sans text-xs">
                  <LinkIcon size={12} /> View Project
                </a>
              )}
            </div>
            <p className="mt-0.5 leading-normal mb-3 text-gray-700 text-xs">{proj.description || 'Project description...'}</p>
          </div>
        ))}
      </Section>

      {/* Skills */}
      <Section title="Skills">
        <div className="flex flex-wrap gap-2 font-sans mt-1">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <span key={index} className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">
                {skill}
              </span>
            ))
          ) : (
            <p className="text-gray-500 mb-4">Your skills will appear here.</p>
          )}
        </div>
      </Section>
    </div>
  );
};

export default ResumePreview;
