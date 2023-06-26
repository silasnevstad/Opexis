import React, { useContext } from 'react';
import '../styles/Steps.css'
import { ProjectContext } from '../context/ProjectContext';
import { UIContext } from '../context/UIContext';

const Steps = () => {
    const { projects, setProjects, activeProjectIndex } = useContext(ProjectContext);
    const { loading } = useContext(UIContext);
    const project = projects[activeProjectIndex];
    const steps = ['setup', 'clarify', 'generate'];
    const stepsText = {
        'setup': 'Setup', // Project
        'clarify': 'Clarify', // Specs
        'generate': 'Generate' // Files
    }

    const updateStep = (step) => {
        if (step === 'setup' || steps.findIndex(s => s === project.finishedState) < steps.findIndex(s => s === step)) {
            // Don't allow going back to the setup step or skipping ahead.
            return;
        }
        const updatedProjects = projects.map((project, index) => {
            if (index !== activeProjectIndex) {
                return project;
            }
            return {
                ...project,
                currentState: step,
            };
        });
        setProjects(updatedProjects);
    }

    const getNextStep = (step) => {
        const index = steps.findIndex(s => s === step);
        const nextStep = loading ? steps[index] : steps[index];
        return index < steps.length - 1 ? nextStep : null;
    }

    const isStepComplete = (step) => {
        const index = steps.findIndex(s => s === step);
        return index < steps.findIndex(s => s === project.finishedState);
    }

    const statusCircle = (step) => {
        if (loading && getNextStep(project.finishedState) === step) {
            return 'loading';
        }
        if ((project.finishedState === 'generate' && step === 'generate' && !loading) || isStepComplete(step)) {
            return 'complete';
        }
        if (project.finishedState === step) {
            return 'active';
        }
        return 'inactive';
    }

    return (
        <div className="steps-outer-container">
            <div className="steps-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-list"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                Steps
            </div>
            <div className="steps-container">
                {steps.map((step, index) => (
                    <div 
                        key={index} 
                        className={`${project.finishedState === step ? 'step-outer-active' : 'step-outer'}`}
                        onClick={() => {
                            // Only call updateStep if it's not the setup step, and it's not ahead of the current step
                            if (step !== 'setup' && steps.findIndex(s => s === step) <= steps.findIndex(s => s === project.finishedState)) {
                                updateStep(step);
                            }
                        }}
                    >
                        <div className={`status-circle ${statusCircle(step)}`}></div>
                        <div className={`step-text ${project.finishedState === step ? 'active' : ''}`}>{stepsText[step]}</div>
                        {/* {project.state === step && index < 2 && <svg className="step-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path></svg>} */}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Steps;
