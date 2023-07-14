import React, { useState, useContext } from 'react'
import { ProjectContext } from '../context/ProjectContext';
import { UIContext } from '../context/UIContext';
import { UserContext } from '../context/UserContext';
import '../styles/Workspaces.css'

const Workspaces = ({ createNewProject, handleDeleteProject, onClose }) => {
    const { projects, setProjects, activeProjectIndex, setActiveProjectIndex } = useContext(ProjectContext);
    const { setSignUpModalOpen, setAccountModalOpen } = useContext(UIContext);
    const { userId } = useContext(UserContext);

    const [showPencilButton, setShowPencilButton] = useState(-1);
    const [isEditing, setIsEditing] = useState(-1);
    const [isDeleting, setIsDeleting] = useState(-1);
    const [tempName, setTempName] = useState('');

    const handleInputChange = (e) => {
        setTempName(e.target.value);
    }

    const updateProjectName = (index) => {
        const newProjects = [...projects];
        newProjects[index].name = tempName;
        setProjects(newProjects);
        setIsEditing(-1);
    }

    const handleSetActiveProject = (index) => {
        // if mobile, close sidebar
        if (window.innerWidth < 768) {
            onClose();
        }
        setActiveProjectIndex(index);
    }

    return (
        <div className="workspace-main">
            <div className="App-main-left-header">
                <h1 className="App-main-left-header-title">Workspaces</h1>
                <div className="App-main-left-header-buttons">
                    <button className="App-main-left-header-button" onClick={createNewProject}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                    <button className="App-main-left-header-button" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sidebar"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                    </button>
                </div>
            </div>

            <div className="workspaces">   
                {[...projects].map((project, index) => ( //.sort((a, b) => b.lastModified - a.lastModified)
                    project && (
                    <div
                        className={`workspaces-workspace ${index === activeProjectIndex ? 'active' : ''}`}
                        key={project.id}
                        onClick={() => handleSetActiveProject(index)}
                        onMouseEnter={() => setShowPencilButton(index)}
                        onMouseLeave={() => setShowPencilButton(-1)}
                    >
                        <div className="workspaces-workspace-inner">
                            <div className="workspaces-workspace-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-briefcase"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                            </div>
                            <div className="workspaces-workspace-name">
                                {isEditing === index ? 
                                    <input type="text" value={tempName} onChange={handleInputChange} onBlur={() => updateProjectName(index)} onKeyDown={(e) => e.key === 'Enter' && updateProjectName(index)} autoFocus /> :
                                    project.name}
                            </div>
                        </div>
                        {showPencilButton === index && <div className="workspaces-workspace-inner-bottom">
                            {isDeleting === index ? <svg onClick={() => {handleDeleteProject(project.id); setIsDeleting(-1)}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                : <svg onClick={() => setIsDeleting(index)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            }
                            <svg onClick={() => {setIsEditing(index); setTempName(project.name)}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        </div>} 
                        {/* <svg onClick={() => updateProjectName(index)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg> */}
                    </div>
                )))}
                 <div className="workspaces-big-divider"></div>     
            </div>



            <footer className="App-main-left-footer">
                <div className="App-main-left-bottom">
                    {userId ?
                        <button className="App-main-left-bottom-button" onClick={() => setAccountModalOpen(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            Settings
                        </button>
                    :
                    <button className="App-main-left-bottom-button" onClick={() => setSignUpModalOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        Sign Up
                    </button>}
                </div>
                <p className="App-main-left-footer-text">Beta</p>
                <p className="App-main-left-footer-text">1.1</p>
            </footer>
        </div>
    )
}

export default Workspaces