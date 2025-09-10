import React, { useState } from 'react';
import { CVData, Experience, Education, Skill, Language } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Icon } from './ui/Icon';
import { generateSummary } from '../services/geminiService';

interface CvFormProps {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
}

// FIX: Moved Section and ItemCard before CvForm to avoid temporal dead zone errors.
const Section: React.FC<{ title: string; icon?: React.ComponentProps<typeof Icon>['name']; children: React.ReactNode }> = ({ title, icon, children }) => (
  <Card>
    <CardHeader>
      <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        {icon && <Icon name={icon} className="w-5 h-5 text-blue-600" />}
        {title}
      </h2>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const ItemCard: React.FC<{ children: React.ReactNode; onRemove: () => void }> = ({ children, onRemove }) => (
  <div className="border border-gray-200 rounded-lg p-4 mb-4 relative">
    <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={onRemove}>
      <Icon name="trash" className="w-5 h-5 text-red-500"/>
    </Button>
    {children}
  </div>
);

const CvForm: React.FC<CvFormProps> = ({ cvData, setCvData }) => {
  
  // FIX: The original handleChange function had a syntax error in its generic
  // definition (<T,>) and was not designed to handle non-object properties like `summary`.
  // This new implementation correctly updates both nested object properties (like personalInfo)
  // and top-level primitive properties (like summary).
  const handleChange = (section: keyof CVData, field: string, value: any) => {
    setCvData(prev => {
      const sectionValue = prev[section];
      if (typeof sectionValue === 'object' && sectionValue !== null && !Array.isArray(sectionValue)) {
        // This branch handles nested objects like `personalInfo`.
        return {
          ...prev,
          [section]: {
            ...(sectionValue as object),
            [field]: value,
          },
        };
      } else {
        // This branch handles top-level primitive properties like `summary`.
        // The `field` parameter is ignored, and the `value` is assigned directly
        // to the property specified by `section`.
        return {
          ...prev,
          [section]: value,
        };
      }
    });
  };

  // FIX: Corrected syntax error in generic definition from <T> to <T,> to avoid ambiguity with JSX syntax in a .tsx file.
  const handleArrayChange = <T,>(section: 'experience' | 'education' | 'skills' | 'languages', index: number, field: keyof T, value: any) => {
    setCvData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addArrayItem = (section: 'experience' | 'education' | 'skills' | 'languages') => {
    const newItem: any = { id: crypto.randomUUID() };
    switch (section) {
      case 'experience':
        newItem.jobTitle = ''; newItem.company = ''; newItem.location = ''; newItem.startDate = ''; newItem.endDate = ''; newItem.description = '';
        break;
      case 'education':
        newItem.degree = ''; newItem.institution = ''; newItem.location = ''; newItem.startDate = ''; newItem.endDate = ''; newItem.description = '';
        break;
      case 'skills':
        newItem.name = ''; newItem.level = 3;
        break;
      case 'languages':
        newItem.name = ''; newItem.proficiency = 'Basic';
        break;
    }
    setCvData(prev => ({ ...prev, [section]: [...prev[section], newItem] }));
  };

  const removeArrayItem = (section: 'experience' | 'education' | 'skills' | 'languages', id: string) => {
    setCvData(prev => ({
      ...prev,
      [section]: prev[section].filter((item: any) => item.id !== id),
    }));
  };

  // AI Summary State
  const [summaryPrompt, setSummaryPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    setError('');
    try {
      const summary = await generateSummary(summaryPrompt);
      // FIX: The original call had invalid generic arguments. The updated handleChange
      // function no longer requires them for this operation. For summary updates,
      // the second argument is ignored, but passed for consistency.
      handleChange('summary', 'summary', summary);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className="space-y-6">
      <Section title="Personal Information" icon="user">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" value={cvData.personalInfo.fullName} onChange={e => handleChange('personalInfo', 'fullName', e.target.value)} />
          <Input label="Job Title" value={cvData.personalInfo.jobTitle} onChange={e => handleChange('personalInfo', 'jobTitle', e.target.value)} />
          <Input label="Email" type="email" value={cvData.personalInfo.email} onChange={e => handleChange('personalInfo', 'email', e.target.value)} />
          <Input label="Phone" value={cvData.personalInfo.phone} onChange={e => handleChange('personalInfo', 'phone', e.target.value)} />
          <Input className="col-span-2" label="Address" value={cvData.personalInfo.address} onChange={e => handleChange('personalInfo', 'address', e.target.value)} />
          <Input label="LinkedIn" value={cvData.personalInfo.linkedin} onChange={e => handleChange('personalInfo', 'linkedin', e.target.value)} />
          <Input label="GitHub" value={cvData.personalInfo.github} onChange={e => handleChange('personalInfo', 'github', e.target.value)} />
          <Input className="col-span-2" label="Profile Picture URL" value={cvData.personalInfo.profilePicture} onChange={e => handleChange('personalInfo', 'profilePicture', e.target.value)} />
        </div>
      </Section>
      
      <Section title="Professional Summary" icon="sparkles">
         <Textarea label="Tell us about your career goals, skills, or a job description you're targeting" placeholder="e.g., 'React developer with 5 years experience, seeking a role in a fast-paced startup focusing on fintech'." value={summaryPrompt} onChange={e => setSummaryPrompt(e.target.value)} rows={3} />
         <Button onClick={handleGenerateSummary} disabled={isGenerating} className="mt-2 w-full">
            {isGenerating ? 'Generating...' : '✨ Generate with AI'}
         </Button>
         {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
         <Textarea className="mt-4" label="Your Summary" value={cvData.summary} onChange={e => handleChange('summary', 'summary', e.target.value)} rows={5} />
      </Section>

      <Section title="Work Experience" icon="briefcase">
        {cvData.experience.map((exp, index) => (
          <ItemCard key={exp.id} onRemove={() => removeArrayItem('experience', exp.id)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Job Title" value={exp.jobTitle} onChange={e => handleArrayChange<Experience>('experience', index, 'jobTitle', e.target.value)} />
              <Input label="Company" value={exp.company} onChange={e => handleArrayChange<Experience>('experience', index, 'company', e.target.value)} />
              <Input label="Location" value={exp.location} onChange={e => handleArrayChange<Experience>('experience', index, 'location', e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Start Date" type="month" value={exp.startDate} onChange={e => handleArrayChange<Experience>('experience', index, 'startDate', e.target.value)} />
                <Input label="End Date" type="month" value={exp.endDate} onChange={e => handleArrayChange<Experience>('experience', index, 'endDate', e.target.value)} />
              </div>
              <Textarea className="col-span-2" label="Description" value={exp.description} onChange={e => handleArrayChange<Experience>('experience', index, 'description', e.target.value)} rows={4} />
            </div>
          </ItemCard>
        ))}
        <Button variant="secondary" onClick={() => addArrayItem('experience')} className="w-full mt-2">
          <Icon name="plus" className="w-4 h-4 mr-2" /> Add Experience
        </Button>
      </Section>
      
      <Section title="Education" icon="academicCap">
        {cvData.education.map((edu, index) => (
          <ItemCard key={edu.id} onRemove={() => removeArrayItem('education', edu.id)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Degree" value={edu.degree} onChange={e => handleArrayChange<Education>('education', index, 'degree', e.target.value)} />
              <Input label="Institution" value={edu.institution} onChange={e => handleArrayChange<Education>('education', index, 'institution', e.target.value)} />
              <Input label="Location" value={edu.location} onChange={e => handleArrayChange<Education>('education', index, 'location', e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Start Date" type="month" value={edu.startDate} onChange={e => handleArrayChange<Education>('education', index, 'startDate', e.target.value)} />
                <Input label="End Date" type="month" value={edu.endDate} onChange={e => handleArrayChange<Education>('education', index, 'endDate', e.target.value)} />
              </div>
              <Textarea className="col-span-2" label="Description" value={edu.description} onChange={e => handleArrayChange<Education>('education', index, 'description', e.target.value)} rows={3} />
            </div>
          </ItemCard>
        ))}
        <Button variant="secondary" onClick={() => addArrayItem('education')} className="w-full mt-2">
           <Icon name="plus" className="w-4 h-4 mr-2" /> Add Education
        </Button>
      </Section>
      
      <Section title="Skills">
        <div className="space-y-4">
        {cvData.skills.map((skill, index) => (
          <div key={skill.id} className="flex items-center gap-2">
            <Input className="flex-grow" placeholder="e.g., React" value={skill.name} onChange={e => handleArrayChange<Skill>('skills', index, 'name', e.target.value)} />
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(level => (
                <button key={level} onClick={() => handleArrayChange<Skill>('skills', index, 'level', level)}>
                  <span className={`w-4 h-4 block rounded-full ${skill.level >= level ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                </button>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => removeArrayItem('skills', skill.id)}>
              <Icon name="trash" className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
        </div>
        <Button variant="secondary" onClick={() => addArrayItem('skills')} className="w-full mt-4">
          <Icon name="plus" className="w-4 h-4 mr-2" /> Add Skill
        </Button>
      </Section>
      
      <Section title="Languages">
        <div className="space-y-4">
          {cvData.languages.map((lang, index) => (
            <div key={lang.id} className="flex items-center gap-2">
              <Input className="w-1/2" placeholder="e.g., English" value={lang.name} onChange={e => handleArrayChange<Language>('languages', index, 'name', e.target.value)} />
              <select className="w-1/2 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={lang.proficiency} onChange={e => handleArrayChange<Language>('languages', index, 'proficiency', e.target.value)}>
                <option>Basic</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Native</option>
              </select>
              <Button variant="ghost" size="sm" onClick={() => removeArrayItem('languages', lang.id)}>
                <Icon name="trash" className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="secondary" onClick={() => addArrayItem('languages')} className="w-full mt-4">
          <Icon name="plus" className="w-4 h-4 mr-2" /> Add Language
        </Button>
      </Section>

    </div>
  );
};

export default CvForm;
