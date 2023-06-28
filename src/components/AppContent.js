import React, { useCallback, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import { UIContext } from '../context/UIContext';
import { ProjectContext } from '../context/ProjectContext';
import { onAuthStateChanged } from 'firebase/auth';
import { signIn, signUp, signOutUser, getProjects, addProject, updateProject, deleteProject, auth } from '../services/firebase';
import AccountModal from './AccountModal';
import SignUpModal from './SignUpModal';
import ErrorModal from './ErrorModal';
import Workspaces from './Workspaces';
import OutputContent from './OutputContent';
import '../styles/App.css';

function AppContent() {
    // Context
    const {
      setUserApiKey, setUserEmail,
      userId, setUserId,
    } = useContext(UserContext);
  
    const {
      signUpModalOpen, setSignUpModalOpen,
      accountModalOpen, setAccountModalOpen,
      isSidebarOpen, setIsSidebarOpen,
      setIsLoading,
      isError, setIsError,
    } = useContext(UIContext);
  
    const {
      projects, setProjects,
      activeProjectIndex, setActiveProjectIndex,
    } = useContext(ProjectContext);
  
    // Refs
    const isMounted = useRef(false);
  
    // Effects
    useEffect(() => {
      isMounted.current = true;
      // Auth state changed
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user && isMounted.current) {
          // User is signed in
          const { uid, email } = user;
          setUserEmail(email);
          setUserId(uid);
          const projectsRes = await getProjects(uid);
          if (projectsRes.success) {
            // if there are no projects, add a new one
            if (projectsRes.projects.length === 0) {
              const addProjectRes = await addProject(uid, {
                name: 'New Project',
                prompt: '',
                currentState: 'setup',
                finishedState: '',
                questions: [],
                messages: [],
                outputFiles: [],
                lastModified: Date.now(),
                isDirty: false,
              });
              if (addProjectRes.success) {
                setProjects([addProjectRes.project]);
              } else {
                // handle error
                console.error(addProjectRes.error);
              }
            } else {
              setProjects(projectsRes.projects);
            }
          } else {
            // handle error
            console.error(projectsRes.error);
          }
        } else if (!user && isMounted.current) {
          // User is signed out
          setUserId('');
          setUserEmail('');
          setProjects([{
            name: 'New Project',
            prompt: '',
            currentState: 'setup',
            finishedState: '',
            questions: [],
            messages: [],
            outputFiles: [],
            lastModified: Date.now(),
            isDirty: false,
          }]);
        }
      });
  
      // Cleanup
      return () => {
        unsubscribe();
        isMounted.current = false;
      };
    }, [setUserId, setUserEmail, setProjects]);
  
    const updateProjects = useCallback(async () => {
      if (!userId) return;
    
      const updatedProjects = JSON.parse(JSON.stringify(projects));
      let newProjectAdded = false;
    
      for (let index = 0; index < updatedProjects.length; index++) {
        const project = updatedProjects[index];
        if (project.isDirty) {
          if (project.id) {
            await updateProject(userId, project.id, project);
            project.isDirty = false; // Reset dirty flag after update
          } else {
            const res = await addProject(userId, project);
            if (res && res.success) {
              updatedProjects[index].id = res.id;
              newProjectAdded = true;
              project.isDirty = false; // Reset dirty flag after update
            } else if (res && res.error) {
              console.error(res.error);
            } else {
              console.error("Unexpected error in addProject");
            }
          }
        }
      }
    
      // Only update the projects state if a new project was added or any project was updated
      if (newProjectAdded || updatedProjects.some(project => project.isDirty)) {
        setProjects(updatedProjects);
      }
    }, [projects, userId, setProjects]);
    
    useEffect(() => {
      updateProjects();
    }, [userId, updateProjects]);
  
    const handleSignUp = async (email, password) => {
      const res = await signUp(email, password);
      if (res.success) {
        setSignUpModalOpen(false);
        setUserEmail(res.user.email);
        setUserId(res.user.uid);
        const newProject = { name: 'New Project', prompt: '', currentState: 'setup', finishedState: '', questions: [], messages: [], outputFiles: [], lastModified: Date.now(), isDirty: false };
        const projectsRes = await addProject(res.user.uid, newProject);
        if (projectsRes.success) {
          setProjects([projectsRes.project]);
        } else {
          console.error(projectsRes.error);
        }
      } else {
        console.error(res.error);
      }
    }
  
    const handleLogin = async (email, password) => {
      setProjects([]);
      const res = await signIn(email, password);
      if (res.success) {
        setSignUpModalOpen(false);
        setUserEmail(res.user.email);
        setUserId(res.user.uid);
        setIsLoading(false);
        const projectsRes = await getProjects(res.user.uid);
        if (projectsRes.success) {
          setProjects(projectsRes.projects);
        } else {
          console.error(projectsRes.error);
        }
      } else {
        console.error(res.error);
      }
    }
  
    const handleLogout = async () => {
      const res = await signOutUser();
      if (res.success) {
        setAccountModalOpen(false);
        setProjects([{ name: 'New Project', prompt: '', currentState: 'setup', finishedState: '', questions: [], messages: [], outputFiles: [], lastModified: Date.now(), isDirty: false }]);
        setActiveProjectIndex(0);
        setUserEmail('');
        setUserId('');
        setUserApiKey('');
      } else {
        console.error(res.error);
      }
    }
  
    const createNewProject = async () => {
      const newProject = {
        name: 'New Project',
        prompt: '',
        currentState: 'setup',
        finishedState: '',
        questions: [],
        messages: [],
        outputFiles: [],
        isDirty: false,
        lastModified: Date.now(),
      };
      if (userId) {
        const res = await addProject(userId, newProject);
        if (res && res.success) {
          newProject.id = res.id;
        } else if (res && res.error) {
          console.error(res.error);
        } else {
          console.error("Unexpected error in addProject");
        }
      }

      setProjects([newProject, ...projects]);
      setActiveProjectIndex(0);
    };  
  
    const handleDeleteProject = async (projectId) => {
      if (projects.length <= 1) {
        return;
      }
      if (!userId) {
        const newProjects = projects.filter(p => p.id !== projectId);
        setProjects(newProjects);
        setActiveProjectIndex(0);
        return;
      }
      const res = await deleteProject(userId, projectId);
      if (res.success) {
        const newProjects = projects.filter(p => p.id !== projectId);
        setProjects(newProjects);
        if (activeProjectIndex >= newProjects.length) {
          setActiveProjectIndex(newProjects.length - 1);
        }
      } else {
        console.error(res.error);
      }
    }
  
    return (
      <div className="App">
        {(accountModalOpen || signUpModalOpen) && <div className="overlay"></div>}
        {isSidebarOpen && (
          <main className={`App-main-left ${!isSidebarOpen ? 'closed' : ''}`}>
            <Workspaces
              createNewProject={createNewProject}
              handleDeleteProject={handleDeleteProject}
              onClose={() => setIsSidebarOpen(false)}
            />
          </main>
        )}
        {/* {(!isSidebarOpen || window.innerWidth < 768) && ( */}
          <button className="sidebar-open-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sidebar"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
          </button>
        {/* )} */}
        <main className={`App-main-right ${!isSidebarOpen ? 'full-width' : 'half-width'}`}>
          {accountModalOpen && <AccountModal handleLogout={handleLogout} />}
          {signUpModalOpen && <SignUpModal onLogin={handleLogin} onSignUp={handleSignUp} />}
          {isError && <ErrorModal onClose={() => setIsError(false)} />}

          <div className="App-main-right-header">
            <h1 className="App-main-right-header-title">Opexis<span className="App-main-right-header-title-span">GPT</span></h1>
          </div>

          <OutputContent />

          <footer className="App-main-footer">
            <p className="App-main-footer-text">Silas Nevstad</p>  
            <p className="App-main-footer-text">Opexis © 2023</p>
          </footer>
        </main>
      </div>
    )
}

export default AppContent;