import React, { useState, useContext } from 'react'
import { ProjectContext } from '../context/ProjectContext'
import { examplesIdeas } from '../services/utils'
import '../styles/Examples.css'

const Examples = ({ onSetup }) => {
    const { setInput } = useContext(ProjectContext);
    const [randomExamples, setRandomExamples] = useState(window.innerWidth < 768 ? examplesIdeas.filter(example => example.length < 30).sort(() => Math.random() - Math.random()).slice(0, 4) 
        : examplesIdeas.sort(() => Math.random() - Math.random()).slice(0, 4));

    const handleSetup = (prompt) => {
        setInput(prompt);
        onSetup(prompt);
    }

    const onLoadMore = () => {
        const newExamples = window.innerWidth < 768 ? examplesIdeas.filter(example => example.length < 30).sort(() => Math.random() - Math.random()).slice(0, 2)
            : examplesIdeas.filter(example => !randomExamples.includes(example)).sort(() => Math.random() - Math.random()).slice(0, 2);
        setRandomExamples([...randomExamples, ...newExamples]);
    }

    return (
        <div className="App-main-right-examples">
            <h1 className="App-main-right-examples-title">Examples</h1>
            <div className="App-main-right-examples-buttons">
                {randomExamples.map((example, index) => (
                    <button className="examples-button" onClick={() => handleSetup(example)} key={index}>
                        {example}
                    </button>
                ))}
            </div>
            {randomExamples.length < 8 && 
                <button className="icon-btn add-btn" onClick={onLoadMore}>
                    <div className="add-icon"></div>
                    <div className="btn-txt">Load More</div>
                </button>}
        </div>
    )
}

export default Examples
