import { useState, useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';

const Files = () => {
    const { projects, setProjects, activeProjectIndex, selectedFileIndex, setSelectedFileIndex } = useContext(ProjectContext);
    const project = projects[activeProjectIndex];
    const [showCopyButton, setShowCopyButton] = useState(-1);
    const [showAlert, setShowAlert] = useState(false);
    
    const handleClick = (index) => {
        const updatedProjects = projects.map((project, index) => {
            if (index !== activeProjectIndex) {
                return project;
            }
            return {
                ...project,
                currentState: "generate",
            };
        });
        setProjects(updatedProjects);
        setSelectedFileIndex(index);
    };

    const handleCopyClick = (code, e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(code);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    return (
        <div className="steps-outer-container">
            <div className="steps-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                Files
            </div>
            <div className="steps-container">
                {showAlert && 
                    <div className="copy-alert">Code Copied!</div>
                }
                {project.outputFiles.length === 0 ? (
                    <div className="step">
                        <div className="step-text-faded">No files</div>
                    </div>
                ) : (
                    <>
                        {project.outputFiles.map((file, index) => (
                            <div 
                                key={index} 
                                className={`step-outer ${project.outputFiles[selectedFileIndex].filename === file.filename ? 'step-outer-active-files' : ''}`}
                                onMouseEnter={() => setShowCopyButton(index)}
                                onMouseLeave={() => setShowCopyButton(-1)}
                                onClick={() => handleClick(index)}
                            >
                                <div className={`step-text ${project.finishedState === file ? 'active' : ''}`}>{file.filename}</div>
                                {showCopyButton === index && project.outputFiles[selectedFileIndex].filename === file.filename && 
                                    <div className="copy-icon-container">
                                        <svg 
                                            onClick={(e) => handleCopyClick(file.code, e)} 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            width="24" 
                                            height="24" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            className="feather feather-copy copy-icon"
                                        >
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                    </div>
                                }
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}

export default Files;
