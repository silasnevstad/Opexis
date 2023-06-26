import React, { useCallback, useEffect, useContext, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import './styles/App.css';
import AccountModal from './components/AccountModal';
import SignUpModal from './components/SignUpModal';
import Workspaces from './components/Workspaces';
import Input from './components/Input';
import Steps from './components/Steps';
import Files from './components/Files';
import Code from './components/Code';
import Questions from './components/Questions';
import Examples from './components/Examples';
import { setup, run, code } from './components/Api';
import { parseCodeToString } from './components/utils';
import { signIn, signUp, signOutUser, getProjects, addProject, updateProject, deleteProject, auth } from './components/firebase';

import { UserProvider, UserContext } from './context/UserContext';
import { UIProvider, UIContext } from './context/UIContext';
import { ProjectProvider, ProjectContext } from './context/ProjectContext';


function AppContent() {
  const {
    setUserApiKey, setUserEmail,
    userId, setUserId,
  } = useContext(UserContext);

  const {
    signUpModalOpen, setSignUpModalOpen,
    accountModalOpen, setAccountModalOpen,
    isSidebarOpen, setIsSidebarOpen,
       setLoading,
  } = useContext(UIContext);

  const {
    input,
    projects, setProjects,
    activeProjectIndex, setActiveProjectIndex,
  } = useContext(ProjectContext);

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
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
            const addProjectRes = await addProject(uid, { name: 'New Project', prompt: '', currentState: 'setup', finishedState: '', questions: [], messages: [], outputFiles: [], lastModified: Date.now(), isDirty: false });
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
        setProjects([{ name: 'New Project', prompt: '', currentState: 'setup', finishedState: '', questions: [], messages: [], outputFiles: [], lastModified: Date.now(), isDirty: false }]);
      }
    });

    // Cleanup
    return () => {
      unsubscribe();
      isMounted.current = false;
    };
  }, []);

  const updateProjectState = (newState, newProps) => {
    if (projects[activeProjectIndex]) {
      const newProject = projects[activeProjectIndex];
      newProject.finishedState = newState;
      newProject.currentState = newState;
      newProject.isDirty = true; 
      Object.assign(newProject, newProps);
      if (isMounted.current) {
        setProjects([...projects.slice(0, activeProjectIndex), newProject, ...projects.slice(activeProjectIndex + 1)]);
      }
   } else {
      console.error("Invalid activeProjectIndex", activeProjectIndex);
   }   
  };

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
  }, [projects, userId]);
  
  useEffect(() => {
    updateProjects();
  }, [userId, updateProjects]);
  
  const onSetup = async (prompt = '') => {
    let startingPrompt = '';
    if (prompt) {
      startingPrompt = prompt;
    } else if (input) {
      startingPrompt = input;
    } else {
      return;
    }
    setLoading(true);

    const newProject = projects[activeProjectIndex];
    newProject.finishedState = 'clarify';
    newProject.currentState = 'clarify';
    newProject.prompt = startingPrompt;
    setProjects([...projects.slice(0, activeProjectIndex), newProject, ...projects.slice(activeProjectIndex + 1)]);
    const response = await setup(newProject.messages, startingPrompt);

    if (response.type === 'function_call') {
      updateProjectState('clarify', {
        questions: response.arguments.questions.map(q => ({
          ...q,
          selectedChoice: -1,
          detailedAnswer: ''
        })),
        messages: response.messages
      });
    }
    if (isMounted.current) {
      setLoading(false);
    }

    setLoading(false);
  };

  const onNext = async (answersString) => {
    setLoading(true);

    const newProject = projects[activeProjectIndex];
    newProject.finishedState = 'generate';
    newProject.currentState = 'generate';
    setProjects([...projects.slice(0, activeProjectIndex), newProject, ...projects.slice(activeProjectIndex + 1)]);
    const response = await run(newProject.messages, answersString || '');

    if (response.type === 'function_call') {
      updateProjectState('generate', {
        outputFiles: response.arguments.files,
        messages: response.messages
      });
    }
    if (isMounted.current) {
      setLoading(false);
    }

    setLoading(false);
  };

  const onCodeNext = async () => {
    setLoading(true);

    const codeString = parseCodeToString(projects[activeProjectIndex].outputFiles);

    const newProject = projects[activeProjectIndex];
    newProject.finishedState = 'generate';
    newProject.currentState = 'generate';
    setProjects([...projects.slice(0, activeProjectIndex), newProject, ...projects.slice(activeProjectIndex + 1)]);
    const response = await code(newProject.messages, codeString, input);

    if (response.type === 'function_call') {
      updateProjectState('generate', {
        outputFiles: response.arguments.files,
        messages: response.messages
      });
    }
    if (isMounted.current) {
      setLoading(false);
    }

    setLoading(false);
  };

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
    const res = await signIn(email, password);
    if (res.success) {
      setSignUpModalOpen(false);
      setUserEmail(res.user.email);
      setUserId(res.user.uid);
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
        // handle success
        newProject.id = res.id;
      } else if (res && res.error) {
        // handle error
        console.error(res.error);
      } else {
        console.error("Unexpected error in addProject");
      }
    }
    setProjects([...projects, newProject]);
    setActiveProjectIndex(projects.length);
  };  

  const handleDeleteProject = async (projectId) => {
    // if projects is empty or only has one project, don't delete
    if (projects.length <= 1) {
      return;
    }
    // if not logged in, just remove project from projects
    if (!userId) {
      // remove project from projects
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
      {isSidebarOpen && (
        <main className={`App-main-left ${!isSidebarOpen ? 'closed' : ''}`}>
          <Workspaces
            createNewProject={createNewProject}
            handleDeleteProject={handleDeleteProject}
            onClose={() => setIsSidebarOpen(false)}
          />
        </main>
      )}
      {!isSidebarOpen && (
        <button className="sidebar-open-btn" onClick={() => setIsSidebarOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sidebar"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
        </button>
      )}
      <main className={`App-main-right ${!isSidebarOpen ? 'full-width' : ''}`}>
        {accountModalOpen && <AccountModal handleLogout={handleLogout} />}
        {signUpModalOpen && <SignUpModal onLogin={handleLogin} onSignUp={handleSignUp} />}
        <div className="App-main-right-header">
          <h1 className="App-main-right-header-title">Opexis<span className="App-main-right-header-title-span">GPT</span></h1>
        </div>
        <div className="App-main-output">
          <div className="App-main-output-content">
            {projects[activeProjectIndex].currentState !== 'setup' && 
              <div className="App-main-output-content-left">
                {<Steps />}
                {<Files />}
              </div>
            }
            <div className="App-main-output-content-right">
              <Input onSetup={onSetup} onCodeNext={onCodeNext} />
              {projects[activeProjectIndex].currentState === 'setup' && <Examples onSetup={onSetup} />}
              {projects[activeProjectIndex].currentState === 'clarify' && <Questions onNext={onNext} />}
              {projects[activeProjectIndex].currentState === 'generate' && <Code />}
            </div>
          </div>
        </div>

        <footer className="App-main-footer">
          <p className="App-main-footer-text">Silas Nevstad</p>  
          <p className="App-main-footer-text">Opexis © 2023</p>
        </footer>
      </main>
    </div>
  )
}

function App() {
  return (
    <UserProvider>
      <UIProvider>
        <ProjectProvider>
          <AppContent />
        </ProjectProvider>
      </UIProvider>
    </UserProvider>
  );
}

export default App;
