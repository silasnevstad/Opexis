import React, { useContext, useEffect, useRef } from 'react';
import { UIContext } from '../context/UIContext';
import { ProjectContext } from '../context/ProjectContext';
import { UserContext } from '../context/UserContext';
import { setup, run, code } from '../services/Api';
import { parseCodeToString } from '../services/utils';
import UploadPDF from './Upload';
import Input from './Input';
import Steps from './Steps';
import Files from './Files';
import Code from './Code';
import Questions from './Questions';
import Examples from './Examples';
import '../styles/App.css';

function OutputContent() {
    // let freeUses = 3;

    // Contexts
    const {
        // setSignUpModalOpen,
        setLoading, setIsError,
    } = useContext(UIContext);
    
    const {
        input, setInput,
        projects, setProjects,
        activeProjectIndex,
    } = useContext(ProjectContext);

    const {
        userApiKey,
    } = useContext(UserContext);

    // Refs
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;

        return () => {
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

    const onSetup = async (prompt = '') => {
        // if (freeUses <= 0) {
        //     if (userApiKey) {
        //         alert('You have used all your free uses. Please set an API key in your account settings.');
        //     }
        //     setSignUpModalOpen(true);
        //     return;
        // }

        let startingPrompt = '';
        if (prompt) {
          startingPrompt = prompt;
        } else if (input) {
          startingPrompt = input;
        } else {
          return;
        }
        setLoading(true);
    
        try {
            const newProject = projects[activeProjectIndex];
            newProject.finishedState = 'clarify';
            newProject.currentState = 'clarify';
            newProject.prompt = startingPrompt;
            setProjects([...projects.slice(0, activeProjectIndex), newProject, ...projects.slice(activeProjectIndex + 1)]);
            const response = await setup(newProject.messages, startingPrompt, userApiKey);
    
            if (response.type === 'function_call') {
                updateProjectState('clarify', {
                    questions: response.arguments.questions.map(q => ({
                    ...q,
                    selectedChoice: -1,
                    detailedAnswer: ''
                    })),
                    messages: response.messages
                });
                // if (!userApiKey) {
                //     freeUses--;
                // }
            } else {
              setIsError(true);
            }
        } catch (error) {
            setIsError(true);
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };
    
    const onNext = async (answersString) => {
        setLoading(true);
    // if it works clear the input
        try {
            const newProject = projects[activeProjectIndex];
            newProject.finishedState = 'generate';
            newProject.currentState = 'generate';
            setProjects([...projects.slice(0, activeProjectIndex), newProject, ...projects.slice(activeProjectIndex + 1)]);
            const response = await run(newProject.messages, answersString || '', userApiKey);
    
            if (response.type === 'function_call') {
                updateProjectState('generate', {
                    outputFiles: response.arguments.files,
                    messages: response.messages
                });
                setInput('');
            } else {
              setIsError(true);
            }
        } catch (error) {
            setIsError(true);
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };
    
    const onCodeNext = async () => {
        if (!projects[activeProjectIndex].outputFiles || !input) {
            return;
        }
        setLoading(true);
    
        const codeString = parseCodeToString(projects[activeProjectIndex].outputFiles);
        if (!codeString) {
            setLoading(false);
            return;
        }
    
        const newProject = {...projects[activeProjectIndex], finishedState: 'generate', currentState: 'generate'}; // Cloning the current project
        setProjects([...projects.slice(0, activeProjectIndex), newProject, ...projects.slice(activeProjectIndex + 1)]);
    
        try {
            const response = await code(newProject.messages, codeString, input, userApiKey);
    
            if (response.type === 'function_call') {
                const { outputFiles: existingOutputFiles } = projects[activeProjectIndex];
                const newOutputFiles = { ...existingOutputFiles, ...response.arguments.files };
    
                const newOutputFileList = Object.values(newOutputFiles);
                updateProjectState('generate', {
                    outputFiles: newOutputFileList,
                    messages: response.messages
                });
            } else {
                setIsError(true);
            }
        } catch (error) {
            setIsError(true);
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };
    
    return (
        <div className="App-main-output">
            <div className="App-main-output-content">
                {projects[activeProjectIndex].currentState !== 'setup' && 
                    <div className="App-main-output-content-left">
                        {<Steps />}
                        {<Files />}
                    </div>
                }
                <div className="App-main-output-content-right">
                    <div className="App-main-output-content-right-inputs">
                        <Input onSetup={onSetup} onCodeNext={onCodeNext} />
                        {projects[activeProjectIndex].currentState === 'setup' && <UploadPDF onSetup={onSetup} />}
                    </div>
                    
                    {projects[activeProjectIndex].currentState === 'setup' && <Examples onSetup={onSetup} />}
                    {projects[activeProjectIndex].currentState === 'clarify' && <Questions onNext={onNext} />}
                    {projects[activeProjectIndex].currentState === 'generate' && <Code />}
                </div>
            </div>
        </div>
    )
}

export default OutputContent