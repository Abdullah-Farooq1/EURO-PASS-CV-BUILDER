
import { CVData, Template } from './types';

export const INITIAL_CV_DATA: CVData = {
  personalInfo: {
    fullName: 'Jane Doe',
    jobTitle: 'Frontend Developer',
    email: 'jane.doe@email.com',
    phone: '+1 234 567 890',
    address: '123 Main Street, Anytown, USA',
    linkedin: 'linkedin.com/in/janedoe',
    github: 'github.com/janedoe',
    profilePicture: 'https://picsum.photos/200',
  },
  summary: 'A passionate Frontend Developer with 5+ years of experience in building responsive and user-friendly web applications using React, TypeScript, and Tailwind CSS. Proven ability to collaborate with cross-functional teams to deliver high-quality products.',
  experience: [
    {
      id: crypto.randomUUID(),
      jobTitle: 'Senior Frontend Developer',
      company: 'Tech Solutions Inc.',
      location: 'San Francisco, CA',
      startDate: '2021-01',
      endDate: 'Present',
      description: '- Led the development of a new e-commerce platform, resulting in a 20% increase in sales.\n- Mentored junior developers and conducted code reviews to ensure code quality.\n- Optimized application performance, reducing page load times by 30%.',
    },
  ],
  education: [
    {
      id: crypto.randomUUID(),
      degree: 'B.S. in Computer Science',
      institution: 'University of Technology',
      location: 'Techville, USA',
      startDate: '2015-09',
      endDate: '2019-05',
      description: 'Graduated with honors. Relevant coursework: Data Structures, Algorithms, Web Development.',
    },
  ],
  skills: [
    { id: crypto.randomUUID(), name: 'React', level: 5 },
    { id: crypto.randomUUID(), name: 'TypeScript', level: 5 },
    { id: crypto.randomUUID(), name: 'Tailwind CSS', level: 4 },
    { id: crypto.randomUUID(), name: 'Node.js', level: 3 },
  ],
  languages: [
    { id: crypto.randomUUID(), name: 'English', proficiency: 'Native' },
    { id: crypto.randomUUID(), name: 'Spanish', proficiency: 'Intermediate' },
  ],
};

export const TEMPLATES = [Template.Modern, Template.Europass, Template.Creative];
