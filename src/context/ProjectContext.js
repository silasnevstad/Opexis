import React, { createContext, useState } from 'react';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [input, setInput] = useState('');
  const [projects, setProjects] = useState([{ name: 'New Project', prompt: '', currentState: 'setup', finishedState: '', questions: [], messages: [], outputFiles: [], lastModified: Date.now(), isDirty: false }]);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  return (
    <ProjectContext.Provider value={{
      input,
      setInput,
      projects,
      setProjects,
      activeProjectIndex,
      setActiveProjectIndex,
      selectedFileIndex,
      setSelectedFileIndex,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};