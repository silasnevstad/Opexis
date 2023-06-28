import TextareaAutosize from 'react-textarea-autosize';
import '../styles/Input.css';
import { useRef, useContext, useEffect } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import { UIContext } from '../context/UIContext';

const Input = ({ onSetup, onCodeNext }) => {
    const { input, setInput, projects, activeProjectIndex } = useContext(ProjectContext);
    const { loading } = useContext(UIContext);
    const project = projects[activeProjectIndex];
    const state = project.currentState;
    const prompt = project.prompt;
    const textareaRef = useRef(null);
    const placeholder = state === "generate" ?
        "Any changes you'd like to make?" :
        window.innerWidth > 600 ? "What do you want to build? (Be as specific as you want)" : "What do you want to build?";

    useEffect(() => {
        setInput(prompt);
    }, [prompt, setInput]);

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            // dont go to new line
            e.preventDefault();
            if (state === "generate") {
                onCodeNext();
                return;
            }
            onSetup(input);
        }
    };

    return (
        <TextareaAutosize
            ref={textareaRef}
            className={loading ? "App-main-input-search loading" : "App-main-input-search"}
            type="text"
            placeholder={placeholder}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            minRows={1}
            maxRows={2}
            disabled={state === 'clarify'}
        />
    )
};

export default Input;