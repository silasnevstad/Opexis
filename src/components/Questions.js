import React, { useState, useEffect, useContext, createRef, useRef, forwardRef } from 'react';
import { parseQuestionResponsesToString } from '../services/utils';
import SimpleLoader from './SimpleLoader';
import TypingText from './TypingText';
import TextareaAutosize from 'react-textarea-autosize';
import { ProjectContext } from '../context/ProjectContext';
import { UIContext } from '../context/UIContext';
import '../styles/Questions.css'

const Question = forwardRef(({q, i, onAnswerClick, detailedAnswer, setDetailedAnswer}, ref) => {
    return (
        <div ref={ref} key={i} className="App-main-right-questions-buttons-container">
            <p className="App-main-right-questions-detailed-answer-title">Optional</p>
            <h2 className="App-main-right-questions-buttons-title">{q.question}</h2>
            <div className="App-main-right-questions-possible-answers">
                {q.possibleAnswers.map((answer, index) => (
                    <button className={q.selectedChoice === index ? "questions-button selected" : "questions-button"} key={index} onClick={() => onAnswerClick(i, index)} >
                        {answer}
                    </button>
                ))}
            </div>
            <div className="App-main-right-questions-divider">
                <div className="App-main-right-questions-divider-line"></div>
                <div className="App-main-right-questions-divider-text">OR</div>
                <div className="App-main-right-questions-divider-line"></div>
            </div>
            {/* <p className="App-main-right-questions-detailed-answer-title" style={{opacity: '0.4', paddingLeft: '0.5rem'}}>Optional</p> */}
            <TextareaAutosize
                className="App-main-right-questions-detailed-answer"
                type="text" 
                value={detailedAnswer.text || ''} 
                onChange={(e) => {
                    const newDetailedAnswer = {...detailedAnswer};
                    newDetailedAnswer.text = e.target.value;
                    setDetailedAnswer(newDetailedAnswer);
                }}
                placeholder="Enter detailed answer"
            />
        </div>
    );
});


const Questions = ({ onNext }) => {
    const { projects, setProjects, activeProjectIndex } = useContext(ProjectContext);
    const { loading } = useContext(UIContext);
    const project = projects[activeProjectIndex];
    const [questions, setQuestions] = useState(project.questions);
    const questionRefs = useRef([]);

    useEffect(() => {
        questionRefs.current = questions.map((_, index) => questionRefs.current[index] ?? createRef());
    }, [questions]);

    useEffect(() => {
        const currentProject = projects[activeProjectIndex];
        setQuestions(currentProject.questions);
    }, [projects, activeProjectIndex]);

    const onPossibleAnswerClick = (questionIndex, answerIndex) => {
        const newQuestions = [...questions];
    
        // If selectedChoice is already equal to answerIndex, then set it to -1
        newQuestions[questionIndex].selectedChoice = newQuestions[questionIndex].selectedChoice === answerIndex ? -1 : answerIndex;
    
        setQuestions(newQuestions);
    
        const newProjects = [...projects];
        newProjects[activeProjectIndex].questions = newQuestions;
        setProjects(newProjects);
    
        if (questionRefs.current[questionIndex + 1] && questionRefs.current[questionIndex + 1].current) {
            questionRefs.current[questionIndex + 1].current.scrollIntoView({ behavior: 'smooth' });
        }
    }    
    
    const onDetailedAnswerChange = (questionIndex, text) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].detailedAnswer = text;
        setQuestions(newQuestions);
    
        const newProjects = [...projects];
        newProjects[activeProjectIndex].questions = newQuestions;
        setProjects(newProjects);
    
        if (questionRefs.current[questionIndex + 1] && questionRefs.current[questionIndex + 1].current) {
            questionRefs.current[questionIndex + 1].current.scrollIntoView({ behavior: 'smooth' });
        }
    }
       
    const handleNextClick = () => {
        const newProjects = [...projects];
        newProjects[activeProjectIndex].questions = questions;
        setProjects(newProjects);

        const questionResponses = parseQuestionResponsesToString(questions);
        onNext(questionResponses);

        return;
    }

    const answeredQuestions = () => {
        return questions.reduce((total, question) => {
          return total + (question.selectedChoice !== -1 || question.detailedAnswer !== '' ? 1 : 0);
        }, 0);
      }   

    const unansweredQuestions = () => {
        return questions.length - answeredQuestions();
    }

    if (loading) {
        return (
            <div className="loader-outer-container">
                <div className="loader-title">
                    AI is clarifying your request...
                </div>
                <div className="loader-title-small">
                    (Optionally answer the following questions)
                </div>
                <SimpleLoader />
                <TypingText />
            </div>
        )
    }

    return (
        <div className="App-main-right-questions">
            <div className="App-main-right-questions-header">
                <div className="App-main-right-questions-header-title">
                    <span className="App-main-right-questions-header-title-project-name">Clarify</span>
                    {window.innerWidth > 768 && <span className="App-main-right-questions-header-title-text">{`(${unansweredQuestions()} out of ${questions.length} left)`}</span>}
                </div>
                <button className="App-main-right-questions-footer-button" onClick={handleNextClick}>
                    {answeredQuestions() === 0 ? 'Skip...' : 'Generate...'}
                    <div className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path></svg>
                    </div>
                </button>
            </div>
            <div className="App-main-right-questions-buttons">
                {questions.map((question, index) => (
                    <React.Fragment key={index}>
                        <Question 
                            ref={questionRefs.current[index]}
                            q={question} 
                            i={index} 
                            onAnswerClick={onPossibleAnswerClick} 
                            detailedAnswer={question.detailedAnswer} 
                            setDetailedAnswer={(text) => onDetailedAnswerChange(index, text)}
                        />
                        {<div className="App-main-right-questions-buttons-line"></div>}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}

export default Questions