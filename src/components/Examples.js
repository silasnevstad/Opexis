import React, { useState, useContext } from 'react'
import { ProjectContext } from '../context/ProjectContext'
import { examplesIdeas } from '../components/utils'
import '../styles/Examples.css'

const Examples = ({ onSetup }) => {
    const { setInput } = useContext(ProjectContext);
    
    // pick three random ideas every time the page is loaded
    const [randomExamples, setRandomExamples] = useState(examplesIdeas.sort(() => Math.random() - Math.random()).slice(0, 4));

    const handleSetup = (prompt) => {
        setInput(prompt);
        onSetup(prompt);
    }

    const onLoadMore = () => {
        const newExamples = examplesIdeas.filter(example => !randomExamples.includes(example)).sort(() => Math.random() - Math.random()).slice(0, 2);
        setRandomExamples([...randomExamples, ...newExamples]);
    }

    return (
        <div className="App-main-right-examples">
            <h1 className="App-main-right-examples-title">Examples</h1>
            <div className="App-main-right-examples-buttons">
                {randomExamples.map((example, index) => (
                    <button className="examples-button" onClick={() => handleSetup(example)} key={index}>
                        {example}
                        {/* <div className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path></svg>
                        </div> */}
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
