
import React from 'react';
import { CVData, Template } from '../types';

// Helper function for date formatting
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Modern Template Component
const ModernTemplate: React.FC<{ cvData: CVData }> = ({ cvData }) => {
  const { personalInfo, summary, experience, education, skills, languages } = cvData;
  return (
    <div className="bg-white p-8 text-gray-800 text-sm">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">{personalInfo.fullName}</h1>
        <h2 className="text-xl font-medium text-blue-600 mt-1">{personalInfo.jobTitle}</h2>
        <div className="flex justify-center gap-4 text-xs mt-4 text-gray-600">
          <span>{personalInfo.email}</span>
          <span>&bull;</span>
          <span>{personalInfo.phone}</span>
          <span>&bull;</span>
          <span>{personalInfo.address}</span>
        </div>
        <div className="flex justify-center gap-4 text-xs mt-2 text-gray-600">
          <a href={`https://${personalInfo.linkedin}`} className="hover:text-blue-600">{personalInfo.linkedin}</a>
          <span>&bull;</span>
          <a href={`https://${personalInfo.github}`} className="hover:text-blue-600">{personalInfo.github}</a>
        </div>
      </header>

      <section>
        <h3 className="text-lg font-bold text-gray-900 border-b-2 border-gray-200 pb-1 mb-3">Summary</h3>
        <p className="text-gray-700">{summary}</p>
      </section>

      <section className="mt-6">
        <h3 className="text-lg font-bold text-gray-900 border-b-2 border-gray-200 pb-1 mb-3">Experience</h3>
        {experience.map(exp => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between items-baseline">
              <h4 className="font-bold text-base">{exp.jobTitle}</h4>
              <p className="text-xs text-gray-600">{formatDate(exp.startDate)} - {exp.endDate === 'Present' ? 'Present' : formatDate(exp.endDate)}</p>
            </div>
            <p className="text-sm italic text-gray-700">{exp.company}, {exp.location}</p>
            <ul className="list-disc list-inside mt-2 text-gray-600 text-xs whitespace-pre-wrap">
              {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^-/, '').trim()}</li>)}
            </ul>
          </div>
        ))}
      </section>
      
      <section className="mt-6">
        <h3 className="text-lg font-bold text-gray-900 border-b-2 border-gray-200 pb-1 mb-3">Education</h3>
        {education.map(edu => (
           <div key={edu.id} className="mb-4">
            <div className="flex justify-between items-baseline">
              <h4 className="font-bold text-base">{edu.degree}</h4>
              <p className="text-xs text-gray-600">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
            </div>
            <p className="text-sm italic text-gray-700">{edu.institution}, {edu.location}</p>
            <p className="mt-1 text-gray-600 text-xs">{edu.description}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-2 gap-8 mt-6">
        <section>
          <h3 className="text-lg font-bold text-gray-900 border-b-2 border-gray-200 pb-1 mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => <span key={skill.id} className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">{skill.name}</span>)}
          </div>
        </section>
        <section>
          <h3 className="text-lg font-bold text-gray-900 border-b-2 border-gray-200 pb-1 mb-3">Languages</h3>
           {languages.map(lang => (
             <p key={lang.id} className="text-gray-700 text-sm">{lang.name} <span className="text-gray-500 text-xs">({lang.proficiency})</span></p>
           ))}
        </section>
      </div>

    </div>
  );
};

// Europass Template Component
const EuropassTemplate: React.FC<{ cvData: CVData }> = ({ cvData }) => {
    const { personalInfo, summary, experience, education, skills, languages } = cvData;
  return (
    <div className="bg-white p-6 text-sm">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          {personalInfo.profilePicture && <img src={personalInfo.profilePicture} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-200" />}
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-bold text-blue-800 border-b border-blue-200 pb-1 mb-2">Personal Info</h3>
            <p><strong>Email:</strong> {personalInfo.email}</p>
            <p><strong>Phone:</strong> {personalInfo.phone}</p>
            <p><strong>Address:</strong> {personalInfo.address}</p>
            <p><strong>LinkedIn:</strong> {personalInfo.linkedin}</p>
            <p><strong>GitHub:</strong> {personalInfo.github}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-md mt-4">
            <h3 className="font-bold text-blue-800 border-b border-blue-200 pb-1 mb-2">Skills</h3>
            {skills.map(skill => <p key={skill.id}>{skill.name}</p>)}
          </div>
           <div className="bg-blue-50 p-4 rounded-md mt-4">
            <h3 className="font-bold text-blue-800 border-b border-blue-200 pb-1 mb-2">Languages</h3>
            {languages.map(lang => <p key={lang.id}>{lang.name} ({lang.proficiency})</p>)}
          </div>
        </div>
        <div className="col-span-2">
            <h1 className="text-3xl font-bold text-blue-800">{personalInfo.fullName}</h1>
            <h2 className="text-lg font-semibold text-gray-700">{personalInfo.jobTitle}</h2>
            <p className="mt-4 text-gray-600">{summary}</p>
            
            <h3 className="font-bold text-blue-800 border-b-2 border-blue-200 pb-1 mt-6 mb-3 text-lg">Work Experience</h3>
            {experience.map(exp => (
                 <div key={exp.id} className="mb-4">
                    <p className="font-bold">{exp.jobTitle} at {exp.company}</p>
                    <p className="text-xs text-gray-500">{exp.location} | {formatDate(exp.startDate)} - {exp.endDate === 'Present' ? 'Present' : formatDate(exp.endDate)}</p>
                    <ul className="list-disc list-inside mt-1 text-gray-600 text-xs whitespace-pre-wrap">
                      {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^-/, '').trim()}</li>)}
                    </ul>
                </div>
            ))}
            
            <h3 className="font-bold text-blue-800 border-b-2 border-blue-200 pb-1 mt-6 mb-3 text-lg">Education</h3>
            {education.map(edu => (
                 <div key={edu.id} className="mb-4">
                    <p className="font-bold">{edu.degree}</p>
                    <p className="text-sm">{edu.institution}, {edu.location}</p>
                    <p className="text-xs text-gray-500">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                    <p className="mt-1 text-gray-600 text-xs">{edu.description}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};


// Creative Template Component
const CreativeTemplate: React.FC<{ cvData: CVData }> = ({ cvData }) => {
  const { personalInfo, summary, experience, education, skills, languages } = cvData;
  return (
    <div className="bg-white flex text-sm">
      <aside className="w-1/3 bg-slate-800 text-white p-6">
        {personalInfo.profilePicture && <img src={personalInfo.profilePicture} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-slate-600" />}
        <h3 className="font-bold border-b border-slate-600 pb-1 mb-3 text-lg">Contact</h3>
        <p className="mb-1">{personalInfo.email}</p>
        <p className="mb-1">{personalInfo.phone}</p>
        <p className="mb-4">{personalInfo.address}</p>
        <p className="mb-1">{personalInfo.linkedin}</p>
        <p>{personalInfo.github}</p>

        <h3 className="font-bold border-b border-slate-600 pb-1 mb-3 mt-6 text-lg">Skills</h3>
        {skills.map(skill => (
          <div key={skill.id} className="mb-2">
            <p>{skill.name}</p>
            <div className="w-full bg-slate-600 rounded-full h-1.5">
              <div className="bg-teal-400 h-1.5 rounded-full" style={{ width: `${skill.level * 20}%` }}></div>
            </div>
          </div>
        ))}
        
        <h3 className="font-bold border-b border-slate-600 pb-1 mb-3 mt-6 text-lg">Languages</h3>
        {languages.map(lang => <p key={lang.id}>{lang.name} <span className="text-slate-400">({lang.proficiency})</span></p>)}
      </aside>
      <main className="w-2/3 p-8">
        <h1 className="text-4xl font-extrabold text-slate-800">{personalInfo.fullName}</h1>
        <h2 className="text-xl font-medium text-teal-500 mt-1">{personalInfo.jobTitle}</h2>
        
        <p className="mt-6 text-gray-700">{summary}</p>
        
        <h3 className="font-bold text-slate-800 border-b-2 border-slate-200 pb-1 mt-6 mb-3 text-lg">Experience</h3>
        {experience.map(exp => (
          <div key={exp.id} className="mb-4">
            <p className="font-bold">{exp.jobTitle}</p>
            <div className="flex justify-between text-xs text-gray-600">
                <span>{exp.company}, {exp.location}</span>
                <span>{formatDate(exp.startDate)} - {exp.endDate === 'Present' ? 'Present' : formatDate(exp.endDate)}</span>
            </div>
            <ul className="list-disc list-inside mt-1 text-gray-600 text-xs whitespace-pre-wrap">
                {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^-/, '').trim()}</li>)}
            </ul>
          </div>
        ))}

        <h3 className="font-bold text-slate-800 border-b-2 border-slate-200 pb-1 mt-6 mb-3 text-lg">Education</h3>
        {education.map(edu => (
          <div key={edu.id} className="mb-4">
             <p className="font-bold">{edu.degree}</p>
            <div className="flex justify-between text-xs text-gray-600">
                <span>{edu.institution}, {edu.location}</span>
                <span>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};


// Main Preview Component
interface CvPreviewProps {
  cvData: CVData;
  template: Template;
}

const templateComponents = {
  [Template.Modern]: ModernTemplate,
  [Template.Europass]: EuropassTemplate,
  [Template.Creative]: CreativeTemplate,
};

const CvPreview: React.FC<CvPreviewProps> = ({ cvData, template }) => {
  const TemplateComponent = templateComponents[template];

  return (
    <div id="cv-preview" className="w-[210mm] h-[297mm] bg-white shadow-lg overflow-hidden">
        <TemplateComponent cvData={cvData} />
    </div>
  );
};

export default CvPreview;
